import { Test, TestingModule } from '@nestjs/testing'
import { OffreDePrixController } from './mab9ach'
import { OffreDePrixService } from './offre-de-prix.service'

describe('OffreDePrixController', () => {
  let controller: OffreDePrixController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffreDePrixController],
      providers: [OffreDePrixService],
    }).compile()

    controller = module.get<OffreDePrixController>(OffreDePrixController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
