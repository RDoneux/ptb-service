import { Router, Request, Response } from 'express';
import { Example } from '../entities/example.entity';
import { ExampleRepository } from '../repositories/example.repository';

const exampleController = Router();

exampleController.get('/example', getExample);

async function getExample(request: Request, response: Response) {
  try {
    const firstName: string = request.query?.firstName as string;
    const lastName: string = request.query?.lastName as string;

    if (!firstName || !lastName) {
      response.status(400).json('firstName & lastName are required');
      return;
    }

    const examples: Example[] = await ExampleRepository.findByName(firstName, lastName);
    response.status(200).json(examples);
  } catch (error) {
    response.status(500).json(error);
  }
}

export default exampleController;
