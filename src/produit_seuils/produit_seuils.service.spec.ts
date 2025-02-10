import { Test, TestingModule } from '@nestjs/testing'
import { SeuilProduitService } from './produit_seuils.service'

describe('SeuilProduitService', () => {
  let service: SeuilProduitService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeuilProduitService],
    }).compile()

    service = module.get<SeuilProduitService>(SeuilProduitService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
