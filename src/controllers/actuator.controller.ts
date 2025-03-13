import { Request, Response, Router } from 'express';

const actuatorController = Router();

actuatorController.get('/actuator', getHealth);

function getHealth(request: Request, response: Response): void {
  response.status(200).json({ status: 'UP' });
}

export default actuatorController;
