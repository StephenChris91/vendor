import * as yup from "yup";
import { useFormik } from "formik";
import Product from "@models/product.model";
import Box from "@component/Box";
import Rating from "@component/rating";
import FlexBox from "@component/FlexBox";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import { H2, H5 } from "@component/Typography";
import ProductComment, { ProductCommentProps } from "./ProductComment";

type Props = {
  product: Product;
};

// Sample comments data
const sampleComments: ProductCommentProps[] = [
  {
    name: "John Doe",
    date: "2023-06-01",
    imgUrl: "/assets/images/faces/7.png",
    rating: 4,
    comment: "Great product! I really enjoyed using it.",
  },
  {
    name: "Jane Smith",
    date: "2023-05-28",
    imgUrl: "/assets/images/faces/5.png",
    rating: 5,
    comment: "Excellent quality and fast delivery. Highly recommended!",
  },
];

export default function ProductReview({ product }: Props) {
  const initialValues = {
    rating: "",
    comment: "",
    date: new Date().toISOString(),
  };

  const validationSchema = yup.object().shape({
    rating: yup.number().required("required"),
    comment: yup.string().required("required"),
  });

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    console.log(values);
    resetForm();
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <div>
      <H2 fontWeight="600" mt="55px" mb="20">
        Write a Review for {product.name}
      </H2>

      <form onSubmit={handleSubmit}>
        {/* ... (form fields remain the same) ... */}
      </form>

      {/* Display existing reviews */}
      <Box mt="50px">
        <H2 fontWeight="600" mb="20">
          Customer Reviews
        </H2>
        {sampleComments.map((comment, index) => (
          <ProductComment key={index} {...comment} />
        ))}
      </Box>
    </div>
  );
}
