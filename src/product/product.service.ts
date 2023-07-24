import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { ProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>
    ) {}

    async addProduct(product: ProductDto): Promise<any> {
        product.p_name = product.p_name.toLowerCase().trim();
        const data = await this.productRepo.findOneBy({p_name: product.p_name});
        if(data) {
            return false;
        }
        else {
            await this.productRepo.save(product);
            return true;
        }
    }

    async updateProduct(pid: number, updateDto: UpdateProductDto): Promise<any> {
        updateDto.p_name = updateDto.p_name.toLowerCase().trim();
        const data = await this.productRepo.findOneBy({p_id: pid});
        if(data) {
            await this.productRepo.update(data.p_id, updateDto);
            return true;
        } else {
            return false;
        }
    }

    // async deleteProduct(pname: string): Promise<any> {
    //     pname = pname.toLowerCase().trim();
    //     const data = await this.productRepo.findOneBy({p_name: pname});
    //     if(data) {
    //         await this.productRepo.delete(data.p_id);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    async deleteProduct(pid: number): Promise<any> {
      
      const data = await this.productRepo.findOneBy({p_id: pid});
      if(data) {
          await this.productRepo.delete(data.p_id);
          return true;
      } else {
          return false;
      }
  }

    async viewAllProducts(): Promise<any> {
        // const query = this.productRepo
        // .createQueryBuilder('product')
        // .select('DISTINCT on (product.p_category) product.p_name, product.p_price, product.p_description, product.p_category')
        // .orderBy('product.p_category', 'ASC')
        // .limit(3);
        // return await query.getMany();
        return await this.productRepo.find({
            select: ['p_name', 'p_price', 'p_description', 'p_category'],
            order: { p_category: 'ASC' },
        });
    }

    async viewProductsByCategory(category: string): Promise<any> {
        const query = this.productRepo
        .createQueryBuilder('product')
        .select(['product.p_name', 'product.p_price', 'product.p_description'])
        .where('product.p_category = :category', { category: category })
        .orderBy('product.p_price', 'ASC');
        return await query.getMany();
    }

    async viewProductByID(productid: number): Promise<any> {
        const query = this.productRepo
        .createQueryBuilder('product')
        .select(['product.p_name', 'product.p_price', 'product.p_description', 'product.p_category'])
        .where('product.p_id = :productid', { productid: productid });
        return await query.getOne();
    }

}
