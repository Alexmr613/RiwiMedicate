import multer from 'multer';

// Guardar temporalmente en la memoria RAM
const storage = multer.memoryStorage();

// Filtro opcional para aceptar solo archivos JSON
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/json') {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Solo se permiten archivos JSON.'));
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});