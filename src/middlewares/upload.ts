import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Guardar temporalmente en memoria RAM (no se escribe nada a disco).
// Ideal para archivos pequeños que se procesan y descartan al vuelo
// (ej: un JSON de importación masiva de medicamentos/inventario).
const storage = multer.memoryStorage();

// Solo se aceptan archivos JSON. Se valida tanto el mimetype como la
// extensión, ya que algunos clientes (curl, Postman con "text/plain",
// etc.) no siempre envían el mimetype correcto.
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const esJsonPorMime = file.mimetype === 'application/json';
  const esJsonPorExtension = file.originalname.toLowerCase().endsWith('.json');

  if (esJsonPorMime || esJsonPorExtension) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

// Middleware de manejo de errores de Multer. Debe colocarse justo
// después del middleware `upload.single(...)` / `upload.array(...)`
// en cada ruta, o registrarse como manejador de errores global.
//
// Ejemplo de uso en una ruta:
//   router.post(
//     '/medicamentos/importar',
//     isAuth, isAdmin,
//     upload.single('archivo'),
//     handleUploadErrors,
//     importarMedicamentos
//   );
export const handleUploadErrors = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo supera el límite de 5MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Formato no válido. Solo se permiten archivos JSON.' });
    }
    return res.status(400).json({ error: `Error al subir el archivo: ${err.message}` });
  }

  if (err) {
    return res.status(400).json({ error: 'No se pudo procesar el archivo enviado.' });
  }

  next();
};