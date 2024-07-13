import { Request, Response } from 'express';

import { z } from 'zod';
import orderValidations from './order.validation';
import OrderServices from './order.service';


const CreateOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const Validation = orderValidations.parse(order);
    const result = await OrderServices.CreateOrderToDb(Validation);
    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
   
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        
        error,
      });
    } else {

      // Handle other errors
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
};

const GetProductByEmail = async (req: Request, res: Response) => {
  try {
    const email: string = req.query.email as string;
    const result = await OrderServices.GetOrderByEmailFromDb(email);
    if (email) {
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully for user email!',
        data: result,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully!',
        data: result,
      });
    }
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: 'Unexpected error occurred',
      error,
    });
  }
};

const OrderController = { CreateOrder, GetProductByEmail };

export default OrderController;
