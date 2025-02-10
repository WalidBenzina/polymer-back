import { Test, TestingModule } from '@nestjs/testing'
import { MarineTrafficService } from './marine-traffic.service'

describe('MarineTrafficService', () => {
  let service: MarineTrafficService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarineTrafficService],
    }).compile()

    service = module.get<MarineTrafficService>(MarineTrafficService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
