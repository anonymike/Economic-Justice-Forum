const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Paystack Configuration - Use environment variables in production
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_be963fa3bffef0f339f8b1cada1659a70919caa8'; // Test key - replace with your actual key
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_b4166a1b54f228da71f1515547a50020dd083e01'; // Test key - replace with your actual key

// Store transactions (in production, use a database)
const transactions = new Map();

// Helper function to validate Paystack configuration
function validatePaystackConfig() {
    if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.includes('your_paystack_secret_key')) {
        console.error('❌ ERROR: Invalid Paystack secret key. Please update PAYSTACK_SECRET_KEY in server.js');
        return false;
    }
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('your_paystack_public_key')) {
        console.error('❌ ERROR: Invalid Paystack public key. Please update PAYSTACK_PUBLIC_KEY in server.js');
        return false;
    }
    return true;
}

// Initialize Paystack Payment
app.post('/api/paystack/initialize', async (req, res) => {
    try {
        // Validate Paystack configuration first
        if (!validatePaystackConfig()) {
            return res.status(500).json({
                success: false,
                error: 'Payment gateway configuration error. Please contact support.'
            });
        }

        const { amount, email, name, phone } = req.body;
        
        console.log('📦 Received payment initialization request:', { amount, email, name, phone });
        
        // Validate required fields
        if (!amount || !email) {
            return res.status(400).json({
                success: false,
                error: 'Amount and email are required'
            });
        }

        if (amount < 100) { // Minimum amount 100 KES
            return res.status(400).json({
                success: false,
                error: 'Minimum donation amount is KES 100'
            });
        }

        // Convert amount to kobo (Paystack uses kobo for NGN, but we'll use cents for KES)
        const amountInCents = Math.round(amount * 100);
        
        // Generate transaction reference
        const transactionRef = `EJF${Date.now()}`;
        
        const paystackPayload = {
            email: email,
            amount: amountInCents,
            currency: 'KES',
            reference: transactionRef,
            callback_url: `${req.protocol}://${req.get('host')}/payment-success.html`,
            metadata: {
                custom_fields: [
                    {
                        display_name: "Donor Name",
                        variable_name: "donor_name",
                        value: name
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: phone || ''
                    },
                    {
                        display_name: "Project",
                        variable_name: "project",
                        value: "Green Digital Justice Hub"
                    }
                ]
            },
            channels: ['card', 'bank', 'ussd', 'mobile_money']
        };

        console.log('🔄 Sending request to Paystack...');
        
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            paystackPayload,
            {
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        console.log('✅ Paystack response received:', response.data);

        if (!response.data.status) {
            throw new Error(response.data.message || 'Paystack initialization failed');
        }

        // Store transaction details
        transactions.set(transactionRef, {
            email,
            amount,
            name,
            phone,
            method: 'Paystack',
            status: 'pending',
            paystackReference: response.data.data.reference,
            authorizationUrl: response.data.data.authorization_url,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Payment initialized successfully',
            data: {
                transactionRef,
                authorizationUrl: response.data.data.authorization_url,
                accessCode: response.data.data.access_code,
                reference: response.data.data.reference
            }
        });

    } catch (error) {
        console.error('❌ Paystack initialization error:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });

        let errorMessage = 'Failed to initialize payment';
        
        if (error.response) {
            // Paystack API error
            errorMessage = error.response.data.message || 'Payment service error';
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage = 'Payment service temporarily unavailable';
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Payment service timeout. Please try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

// Verify Paystack Payment
app.get('/api/paystack/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;
        
        console.log('🔍 Verifying payment:', reference);
        
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const transactionData = response.data.data;
        
        // Update transaction status
        const transaction = transactions.get(reference);
        if (transaction) {
            transaction.status = transactionData.status === 'success' ? 'completed' : 'failed';
            transaction.paystackData = transactionData;
            transaction.verifiedAt = new Date();
            
            if (transactionData.status === 'success') {
                transaction.paymentMethod = transactionData.channel;
                transaction.paidAt = transactionData.paid_at;
                console.log(`✅ Payment completed: ${reference}`);
            } else {
                console.log(`❌ Payment failed: ${reference}`);
            }
        }

        res.json({
            success: true,
            data: {
                status: transactionData.status,
                transaction: transactionData,
                localTransaction: transaction
            }
        });

    } catch (error) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || 'Failed to verify payment'
        });
    }
});

// Get transaction status
app.get('/api/transaction/:ref', (req, res) => {
    const transaction = transactions.get(req.params.ref);
    
    if (!transaction) {
        return res.status(404).json({
            success: false,
            error: 'Transaction not found'
        });
    }
    
    res.json({
        success: true,
        data: transaction
    });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
    const allTransactions = Array.from(transactions.entries()).map(([ref, data]) => ({
        reference: ref,
        ...data
    }));
    
    res.json({
        success: true,
        data: allTransactions
    });
});

// Health check with Paystack connection test
app.get('/api/health', async (req, res) => {
    const health = {
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        transactionCount: transactions.size,
        paystack: {
            configured: validatePaystackConfig(),
            status: 'unknown'
        }
    };

    // Test Paystack connection
    try {
        const response = await axios.get('https://api.paystack.co/bank', {
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
            },
            timeout: 10000
        });
        health.paystack.status = response.data.status ? 'connected' : 'error';
    } catch (error) {
        health.paystack.status = 'disconnected';
        health.paystack.error = error.message;
    }

    res.json(health);
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve payment success page
app.get('/payment-success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment-success.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Main site: http://localhost:${PORT}`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`❤️  Donation page: http://localhost:${PORT}/#donate`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    
    // Validate Paystack configuration
    if (!validatePaystackConfig()) {
        console.log('\n⚠️  IMPORTANT: Please update your Paystack API keys in server.js');
        console.log('   Get your keys from: https://dashboard.paystack.com/#/settings/developer');
    } else {
        console.log('✅ Paystack configuration validated');
    }
});