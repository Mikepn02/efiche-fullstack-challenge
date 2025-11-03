"use client"
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import FormInput from "../shared/FormInput";
import { useLogin } from "@/hooks/use-auth";

const LoginForm = () => {
  const { Text, Title } = Typography;
  const [form] = useForm();
  const loginMutation = useLogin();

  const handleKeyDownPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
      return false;
    }
  }
  const handleOnFinish = async (values: { email: string; password: string }) => {
    await loginMutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <div className=" p-6 max-w-md max-md:mx-auto">
      <Form
        name="normal_login"
        onFinish={handleOnFinish}
        layout="vertical"
        requiredMark={false}
        className="space-y-6"
        form={form}
      >
        <div className="mb-10">
          <Title className="text-3xl font-extrabold">Sign in</Title>
          <Text className="text-sm mt-4">
            Sign in to your account to manage your health information and care programs. Your journey toward improved well-being starts now
          </Text>
        </div>

        <FormInput
          name="email"
          label="E-mail"
          type="email"
          placeholder="Enter your email"
          prefix={<MailOutlined />}
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          prefix={<LockOutlined />}
          onKeyDown={handleKeyDownPress}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
            {
              pattern: /^(?=.*[a-z]).{6,}$/,
              message: "Password must contain at least one letter!",
            },
          ]}
        />

        <Form.Item className="mt-10!">
       <Button
  block
  type="primary"
  htmlType="submit"
  loading={loginMutation.isPending}
  className="w-full shadow-xl px-4 text-sm font-semibold rounded py-6 bg-red-500 text-white [&_.ant-btn-loading-icon]:text-white"
>
  {loginMutation.isPending ? "Logging in..." : "Log in"}
</Button>

        </Form.Item>

        <Text className="text-sm text-center block mt-2">
          Don't have an account?{" "}
          <Link
            href="/guests"
            className="text-primary hover:underline ml-1 whitespace-nowrap"
          >
            continue as guest
          </Link>
        </Text>
      </Form>
    </div>
  );
};

export default LoginForm;