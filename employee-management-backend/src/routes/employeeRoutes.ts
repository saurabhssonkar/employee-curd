import { Router } from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments,
} from '../controllers/employeeController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = Router();

router.use(authMiddleware);
router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.get('/departments', getDepartments);

export default router;