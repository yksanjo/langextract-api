const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Extract endpoint - processes documents
app.post('/api/extract', upload.single('document'), async (req, res) => {
  try {
    const { type, config } = req.body;
    
    // Simulate extraction processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = {
      success: true,
      document_type: type || 'invoice',
      extracted_data: {
        invoice_number: 'INV-2024-001234',
        date: '2024-01-15',
        vendor: {
          name: 'Acme Corporation',
          address: '123 Business Ave, Suite 100, San Francisco, CA 94102',
          email: 'billing@acmecorp.com',
        },
        total: 2547.50,
        currency: 'USD',
        items: [
          { description: 'Professional Services', quantity: 40, unit_price: 50.00, total: 2000.00 },
          { description: 'Software License', quantity: 1, unit_price: 299.00, total: 299.00 },
          { description: 'Support Package', quantity: 1, unit_price: 248.50, total: 248.50 },
        ],
        tax: 254.75,
      },
      confidence: 0.97,
      processing_time: '1.2s',
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Batch extraction
app.post('/api/extract/batch', upload.array('documents', 10), async (req, res) => {
  try {
    const { type } = req.body;
    const results = req.files.map((file, index) => ({
      id: `doc-${index + 1}`,
      filename: file.originalname,
      success: true,
      extracted_data: {
        invoice_number: `INV-2024-${String(index + 1).padStart(6, '0')}`,
        total: Math.floor(Math.random() * 5000) + 100,
      },
    }));

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OCR endpoint
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    res.json({
      success: true,
      text: 'Sample OCR extracted text from the image...',
      confidence: 0.95,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Templates endpoint
app.get('/api/templates', (req, res) => {
  res.json({
    templates: [
      { id: 'invoice', name: 'Invoices', fields: ['invoice_number', 'date', 'vendor', 'total'] },
      { id: 'contract', name: 'Contracts', fields: ['parties', 'dates', 'terms'] },
      { id: 'medical', name: 'Medical Records', fields: ['patient_name', 'diagnoses', 'medications'] },
      { id: 'receipt', name: 'Receipts', fields: ['store', 'date', 'items', 'total'] },
    ],
  });
});

// Workflow execution
app.post('/api/workflow/execute', async (req, res) => {
  try {
    const { workflow } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.json({
      success: true,
      workflow_id: `wf-${Date.now()}`,
      status: 'completed',
      output: { extracted: true, confidence: 0.96 },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`LangExtract API running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
