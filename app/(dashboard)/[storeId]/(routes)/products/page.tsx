
import ProductClient from './components/client'
import prismadb from '@/lib/prismadb';
import { ProductColumn } from './components/columns';
import {format} from "date-fns"
import { formatter } from '@/lib/utils';

async function ProductsPage({params}:{params:{storeId:string}}) {

  const products = await prismadb.product.findMany({
    where:{
      storeId:params.storeId
    },
    include:{
      category:true,
      size:true,
      color:true
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  const formatedProductsData: ProductColumn[]=products.map((item)=>({
    id:item.id,
    name:item.name,
    isFeatured:item.isFeatured,
    isArchived:item.isArchived,
    price:formatter.format(item.price.toNumber()),
    category:item.category.name,
    size:item.size.name,
    color:item.color.value,
    createdAt:format(item.createdAt,"MMMM do, yyyy")
}))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-4 p-8 pt-6'>
          <ProductClient data={formatedProductsData}/>
      </div>

    </div>
  )
}

export default ProductsPage