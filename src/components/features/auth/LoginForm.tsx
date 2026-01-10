"use client";

import { useAppDispatch } from "@/store/hooks";
import { login, fetchProfile } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useEffect } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleSubmit = async (values: LoginFormValues) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      // After successful login, fetch user profile
      await dispatch(fetchProfile());
      message.success("Login successful!");
      router.push("/");
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleSubmit}
      layout="vertical"
      style={{ maxWidth: 400, margin: "0 auto" }}
      autoComplete="off"
    >
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
        rules={[{ required: true, message: "Please input your password!" }]}
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
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
