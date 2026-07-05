import multer from 'multer';
import { Uploads } from 'openai/resources/index.mjs';

const storage = multer.diskStorage({});

export default Uploads = multer({storage})