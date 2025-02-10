import { Test, TestingModule } from '@nestjs/testing'
import { OffreDePrixService } from './offre-de-prix.service'

describe('OffreDePrixService', () => {
  let service: OffreDePrixService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffreDePrixService],
    }).compile()

    service = module.get<OffreDePrixService>(OffreDePrixService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
