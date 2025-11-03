import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Typography, Divider, Space, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { SaveOutlined, CloseOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CreateModalProps<T> {
  visible: boolean;
  onClose: () => void;
  item: T | null;
  title: string;
  fields: {
    name: keyof T | string;
    label: string;
    inputType?: 'text' | 'number' | 'email' | 'password' | 'select' | 'date';
    rules?: any[];
    placeholder?: string;
    options?: { label: string; value: any }[];
    helpText?: string;
  }[];
  onSubmit: (updatedItem: T) => Promise<void>;
}

const CreateModal = <T extends { id?: string }>({
  visible,
  onClose,
  item,
  title,
  fields,
  onSubmit,
}: CreateModalProps<T>) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!item;

  useEffect(() => {
    if (item) {
      // Convert date strings to dayjs objects for DatePicker
      const formValues: any = { ...item };
      Object.keys(formValues).forEach(key => {
        const field = fields.find(f => f.name === key);
        if (field?.inputType === 'date' && formValues[key]) {
          formValues[key] = dayjs(formValues[key]);
        }
      });
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [item, form, fields]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit(values);
      notification.success({
        message: isEditMode ? 'Updated successfully' : 'Created successfully',
        placement: 'topRight',
      });
      form.resetFields();
      onClose();
    } catch (info) {
      console.error('Validation Failed: ', info);
      notification.error({
        message: isEditMode ? 'Update failed' : 'Create failed',
        description: (info as any)?.response?.data?.message || (info as any)?.message || 'Please fix errors and try again.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <Space align="center" style={{ marginBottom: 8 }}>
          {isEditMode ? <EditOutlined style={{ color: '#1890ff' }} /> : <PlusOutlined style={{ color: 'blue' }} />}
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </Space>
      }
      centered
      open={visible}
      onCancel={handleCancel}
      width={560}
      destroyOnHidden
      maskClosable={false}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16 }}>
          <Button 
            icon={<CloseOutlined />} 
            onClick={handleCancel}
            size="large"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            size="large"
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      }
      styles={{
        body: { paddingTop: 24 }
      }}
    >
     
      <Form 
        form={form} 
        layout="vertical" 
        requiredMark="optional"
        size="large"
        autoComplete="off"
      >
        {fields.map(({ name, label, inputType = 'text', rules = [], placeholder, options, helpText }, idx) => (
          <Form.Item 
            key={idx} 
            name={name as string} 
            label={<Text strong>{label}</Text>}
            rules={rules}
            help={helpText}
            style={{ marginBottom: 20 }}
          >
            {inputType === 'number' ? (
              <InputNumber 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                style={{ width: '100%' }}
                controls
              />
            ) : inputType === 'password' ? (
              <Input.Password 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="new-password"
              />
            ) : inputType === 'select' ? (
              <Select
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
                options={options || []}
                showSearch
                allowClear
                notFoundContent={options?.length === 0 ? "No options available" : "No results found"}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            ) : inputType === 'date' ? (
              <DatePicker
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            ) : inputType === 'email' ? (
              <Input 
                type="email" 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="email"
              />
            ) : (
              <Input 
                type={inputType} 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="off"
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateModal;