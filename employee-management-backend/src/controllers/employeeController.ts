import { Request, Response } from 'express';
import { PrismaClient  } from '@prisma/client';

const prisma = new PrismaClient();

interface EmployeeQuery {
  departmentId?: string;
  search?: string;
  page?: string;
  limit?: string;
}

interface EmployeeRequestBody {
  name: string;
  email: string;
  departmentId: number;
}

const getEmployees = async (req: Request<{}, {}, {}, EmployeeQuery>, res: Response) => {
  const { departmentId, search, page = '1', limit = '10' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {
    isDeleted: false,
    ...(departmentId && { departmentId: parseInt(departmentId) }),
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { department: true },
      skip,
      take: parseInt(limit),
    }),
    prisma.employee.count({ where }),
  ]);

  res.json({ employees, total, page: parseInt(page), limit: parseInt(limit) });
};

const createEmployee = async (req: any,  res: any) => {
  const { name, email, departmentId } = req.body;
  if (!name || !email || !departmentId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const employee = await prisma.employee.create({
      data: { name, email, departmentId },
      include: { department: true },
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee' });
  }
};

const updateEmployee = async (req: Request<{ id: string }, {}, EmployeeRequestBody>, res: Response) => {
  const { id } = req.params;
  const { name, email, departmentId } = req.body;

  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { name, email, departmentId },
      include: { department: true },
    });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee' });
  }
};

const deleteEmployee = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.employee.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting employee' });
  }
};

const getDepartments = async (req: Request, res: Response) => {
  const departments = await prisma.department.findMany();
  res.json(departments);
};

export { getEmployees, createEmployee, updateEmployee, deleteEmployee, getDepartments };