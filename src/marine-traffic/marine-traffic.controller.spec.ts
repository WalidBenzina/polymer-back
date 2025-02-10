import { Test, TestingModule } from '@nestjs/testing'
import { MarineTrafficController } from './marine-traffic.controller'

describe('MarineTrafficController', () => {
  let controller: MarineTrafficController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarineTrafficController],
    }).compile()

    controller = module.get<MarineTrafficController>(MarineTrafficController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
