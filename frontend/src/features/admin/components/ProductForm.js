import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from '../../product/productSlice';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from '../../common/Modal';
import toast from 'react-hot-toast';

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);

  const colors = [
    {
      name: 'White',
      class: 'bg-white',
      selectedClass: 'ring-gray-400',
      id: 'white',
    },
    {
      name: 'Gray',
      class: 'bg-gray-200',
      selectedClass: 'ring-gray-400',
      id: 'gray',
    },
    {
      name: 'Black',
      class: 'bg-gray-900',
      selectedClass: 'ring-gray-900',
      id: 'black',
    },
  ];

  const sizes = [
    { name: 'XXS', inStock: true, id: 'xxs' },
    { name: 'XS', inStock: true, id: 'xs' },
    { name: 'S', inStock: true, id: 's' },
    { name: 'M', inStock: true, id: 'm' },
    { name: 'L', inStock: true, id: 'l' },
    { name: 'XL', inStock: true, id: 'xl' },
    { name: '2XL', inStock: true, id: '2xl' },
    { name: '3XL', inStock: true, id: '3xl' },
  ];

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('thumbnail', selectedProduct.thumbnail);
      setValue('stock', selectedProduct.stock);
      setValue('image1', selectedProduct.images[0]);
      setValue('image2', selectedProduct.images[1]);
      setValue('image3', selectedProduct.images[2]);
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
      setValue('highlight1', selectedProduct.highlights[0]);
      setValue('highlight2', selectedProduct.highlights[1]);
      setValue('highlight3', selectedProduct.highlights[2]);
      setValue('highlight4', selectedProduct.highlights[3]);
      setValue(
        'sizes',
        selectedProduct.sizes.map((size) => size.id)
      );
      setValue(
        'colors',
        selectedProduct.colors.map((color) => color.id)
      );
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = { ...selectedProduct };
    product.deleted = true;
    dispatch(updateProductAsync(product));
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="section-title">Product Form</h2>
        <form className="space-y-6" onSubmit={handleSubmit((data) => {
          console.log(data);
          const product = { ...data };
          product.images = [
            product.image1,
            product.image2,
            product.image3,
            product.thumbnail,
          ];
          product.highlights = [
            product.highlight1,
            product.highlight2,
            product.highlight3,
            product.highlight4,
          ];
          product.rating = 0;
          if (product.colors) {
            product.colors = product.colors.map((color) =>
              colors.find((clr) => clr.id === color)
            );
          }
          if (product.sizes) {
            product.sizes = product.sizes.map((size) =>
              sizes.find((sz) => sz.id === size)
            );
          }

          delete product['image1'];
          delete product['image2'];
          delete product['image3'];
          product.price = +product.price;
          product.stock = +product.stock;
          product.discountPercentage = +product.discountPercentage;
          console.log(product);
          if (params.id) {
            product.id = params.id;
            product.rating = selectedProduct.rating || 0;
            dispatch(updateProductAsync(product));
            toast.success('Product Updated');

            reset();
          } else {
            dispatch(createProductAsync(product));
            toast.success('Product Created');
            reset();
          }
        })}>
          <div className="space-y-12 bg-white p-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Add Product
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {selectedProduct && selectedProduct.deleted && (
                  <h2 className="text-red-500 sm:col-span-6">
                    This product is deleted
                  </h2>
                )}

                <div className="sm:col-span-6">
                  <label htmlFor="title" className="label">Product Name</label>
                  <div className="mt-2">
                    <input id="title" name="title" type="text" required className="input-field" {...register('title')} />
                    {errors.title && <p className="text-error">{errors.title.message}</p>}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="description" className="label">Description</label>
                  <div className="mt-2">
                    <textarea id="description" name="description" rows={3} required className="input-field" {...register('description')} />
                    {errors.description && <p className="text-error">{errors.description.message}</p>}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about product.
                  </p>
                </div>

                <div className="col-span-full">
                  <label htmlFor="brand" className="label">Brand</label>
                  <div className="mt-2">
                    <select {...register('brand', { required: 'brand is required' })}>
                      <option value="">--choose brand--</option>
                      {brands.map((brand) => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                    {errors.brand && <p className="text-error">{errors.brand.message}</p>}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="colors" className="label">Colors</label>
                  <div className="mt-2">
                    {colors.map((color) => (
                      <>
                        <input type="checkbox" {...register('colors')} key={color.id} value={color.id} />{' '}
                        {color.name}
                      </>
                    ))}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="sizes" className="label">Sizes</label>
                  <div className="mt-2">
                    {sizes.map((size) => (
                      <>
                        <input type="checkbox" {...register('sizes')} key={size.id} value={size.id} />{' '}
                        {size.name}
                      </>
                    ))}
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="category" className="label">Category</label>
                  <div className="mt-2">
                    <select {...register('category', { required: 'category is required' })}>
                      <option value="">--choose category--</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-error">{errors.category.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="price" className="label">Price</label>
                  <div className="mt-2">
                    <input id="price" name="price" type="number" required className="input-field" {...register('price')} />
                    {errors.price && <p className="text-error">{errors.price.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="discountPercentage" className="label">Discount Percentage</label>
                  <div className="mt-2">
                    <input id="discountPercentage" name="discountPercentage" type="number" required className="input-field" {...register('discountPercentage')} />
                    {errors.discountPercentage && <p className="text-error">{errors.discountPercentage.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="stock" className="label">Stock</label>
                  <div className="mt-2">
                    <input id="stock" name="stock" type="number" required className="input-field" {...register('stock')} />
                    {errors.stock && <p className="text-error">{errors.stock.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="thumbnail" className="label">Thumbnail</label>
                  <div className="mt-2">
                    <input id="thumbnail" name="thumbnail" type="text" required className="input-field" {...register('thumbnail')} />
                    {errors.thumbnail && <p className="text-error">{errors.thumbnail.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="image1" className="label">Image 1</label>
                  <div className="mt-2">
                    <input id="image1" name="image1" type="text" required className="input-field" {...register('image1')} />
                    {errors.image1 && <p className="text-error">{errors.image1.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="image2" className="label">Image 2</label>
                  <div className="mt-2">
                    <input id="image2" name="image2" type="text" required className="input-field" {...register('image2')} />
                    {errors.image2 && <p className="text-error">{errors.image2.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="image3" className="label">Image 3</label>
                  <div className="mt-2">
                    <input id="image3" name="image3" type="text" required className="input-field" {...register('image3')} />
                    {errors.image3 && <p className="text-error">{errors.image3.message}</p>}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="highlight1" className="label">Highlight 1</label>
                  <div className="mt-2">
                    <input id="highlight1" name="highlight1" type="text" className="input-field" {...register('highlight1')} />
                    {errors.highlight1 && <p className="text-error">{errors.highlight1.message}</p>}
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="highlight2" className="label">Highlight 2</label>
                  <div className="mt-2">
                    <input id="highlight2" name="highlight2" type="text" className="input-field" {...register('highlight2')} />
                    {errors.highlight2 && <p className="text-error">{errors.highlight2.message}</p>}
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="highlight3" className="label">Highlight 3</label>
                  <div className="mt-2">
                    <input id="highlight3" name="highlight3" type="text" className="input-field" {...register('highlight3')} />
                    {errors.highlight3 && <p className="text-error">{errors.highlight3.message}</p>}
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label htmlFor="highlight4" className="label">Highlight 4</label>
                  <div className="mt-2">
                    <input id="highlight4" name="highlight4" type="text" className="input-field" {...register('highlight4')} />
                    {errors.highlight4 && <p className="text-error">{errors.highlight4.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Extra{' '}
              </h2>

              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    By Email
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="comments"
                          className="font-medium text-gray-900"
                        >
                          Comments
                        </label>
                        <p className="text-gray-500">
                          Get notified when someones posts a comment on a posting.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-900"
                        >
                          Candidates
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate applies for a job.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="offers"
                          className="font-medium text-gray-900"
                        >
                          Offers
                        </label>
                        <p className="text-gray-500">
                          Get notified when a candidate accepts or rejects an
                          offer.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>

            {selectedProduct && !selectedProduct.deleted && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenModal(true);
                }}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      {selectedProduct && (
        <Modal
          title={`Delete ${selectedProduct.title}`}
          message="Are you sure you want to delete this Product ?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleDelete}
          cancelAction={() => setOpenModal(null)}
          showModal={openModal}
        ></Modal>
      )}
    </>
  );
}

export default ProductForm;
