const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /test/protected:
 *   get:
 *     summary: Ruta protegida de prueba para validar JWT
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso exitoso, devuelve la información del usuario decodificado
 *       401:
 *         description: Token ausente o inválido
 */
router.get('/protected', verificarToken, (req, res) => {
  res.status(200).json({
    message: 'Ruta protegida accesada con éxito',
    user: req.usuario
  });
});

module.exports = router;
