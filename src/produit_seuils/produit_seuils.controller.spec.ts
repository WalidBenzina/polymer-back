import { Test, TestingModule } from '@nestjs/testing'
import { SeuilProduitController } from './produit_seuils.controller'
import { SeuilProduitService } from './produit_seuils.service'

describe('ProduitSeuilsController', () => {
  let controller: SeuilProduitController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeuilProduitController],
      providers: [SeuilProduitService],
    }).compile()

    controller = module.get<SeuilProduitController>(SeuilProduitController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
