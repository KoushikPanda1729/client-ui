"use client";

import { useAppDispatch } from "@/store/hooks";
import { register, fetchProfile } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = async (values: RegisterFormValues) => {
    const result = await dispatch(register(values));
    if (register.fulfilled.match(result)) {
      // After successful register, fetch user profile
      await dispatch(fetchProfile());
      message.success("Registration successful!");
      router.push("/dashboard");
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto" }}
      autoComplete="off"
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please input your first name!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="First Name" size="large" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please input your last name!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Last Name" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          style={{
            backgroundColor: "#FF6B35",
            borderColor: "#FF6B35",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FF5520";
            e.currentTarget.style.borderColor = "#FF5520";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FF6B35";
            e.currentTarget.style.borderColor = "#FF6B35";
          }}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
