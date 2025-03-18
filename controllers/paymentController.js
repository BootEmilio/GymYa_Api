const express = require("express");
const router = express.Router();
const axios = require("axios");

// Access Token (Usar variable de entorno en producción)
const ACCESS_TOKEN = "TEST-1378290191875758-031219-61e09e114ecad9a4ce02acf1b2a2e1e4-2120356194";

// Endpoint para crear la preferencia de pago
router.post("/admin/create-preference", async (req, res) => {
    try {
        const preferenceData = {
            items: [
                {
                    title: `Pago de registro para ${req.body.username}`,
                    unit_price: 899.0, // Precio del registro
                    quantity: 1,
                },
            ],
            payer: {
                email: req.body.email, // Correo del comprador
            },
            back_urls: {
                success: "https://gymya-web.onrender.com/src/html/pago_correcto.html",
                failure: "https://gymya-web.onrender.com/src/html/pago_incorrecto.html",
                pending: "https://gymya-web.onrender.com/src/html/pago_pendiente.html",
            },
            auto_return: "approved",
            metadata: req.body, // Guardar los datos del usuario en el metadata
        };

        const response = await axios.post(
            "https://api.mercadopago.com/checkout/preferences",
            preferenceData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ACCESS_TOKEN}`, // Token seguro
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error al crear la preferencia:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error al crear la preferencia de pago" });
    }
});

module.exports = router;
