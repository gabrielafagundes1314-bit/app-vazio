const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
 
 
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
 
 
router.get('/', (req, res) => {
    res.render('pages/form');
});
 
 
router.post('/enviar', [
    body('nome').notEmpty().withMessage('O campo Nome é obrigatório.'),
    body('email').isEmail().withMessage('Informe um E-mail válido.'),
    body('telefone').notEmpty().withMessage('O campo Telefone é obrigatório.'),
    body('assunto').notEmpty().withMessage('O campo Assunto é obrigatório.'),
    body('mensagem').notEmpty().withMessage('O campo Mensagem é obrigatório.')
], async (req, res) => {
    const erros = validationResult(req);
 
    if (!erros.isEmpty()) {
        return res.render('pages/form', {
            erros: erros.array(),
            dados: req.body
        });
    }
 
    const { nome, email, telefone, assunto, mensagem } = req.body;
 
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Novo contacto do site: ${assunto}`,
        html: `
            <h3>Nova mensagem de contacto</h3>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
        `
    };
 
    try {
        await transporter.sendMail(mailOptions);
        res.render('pages/sucesso');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).send('Ocorreu um erro ao enviar a mensagem.');
    }
});
 
module.exports = router;