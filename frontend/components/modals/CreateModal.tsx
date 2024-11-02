import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Typography, Space, notification, Card } from 'antd';
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
        duration: 3,
      });
      form.resetFields();
      onClose();
    } catch (info) {
      console.error('Validation Failed: ', info);
      notification.error({
        message: isEditMode ? 'Update failed' : 'Create failed',
        description: (info as any)?.response?.data?.message || (info as any)?.message || 'Please fix errors and try again.',
        placement: 'topRight',
        duration: 4,
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
        <div style={{
          background: '#0000FF',
          padding: '24px 32px',
          margin: '-20px -24px 0',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}>
          <Space align="center" size={12}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white',
            }}>
              {isEditMode ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <Title level={3} style={{ margin: 0, color: 'white', fontWeight: 600 }}>
              {title}
            </Title>
          </Space>
        </div>
      }
      centered
      open={visible}
      onCancel={handleCancel}
      width={600}
      destroyOnClose
      maskClosable={false}
      closeIcon={
        <span style={{
          color: 'white',
          fontSize: '24px',
          background: 'rgba(255, 255, 255, 0.2)',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.3s',
        }}>
          ×
        </span>
      }
      footer={
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0 8px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {isEditMode ? 'Update your information' : 'All fields are required unless marked optional'}
          </Text>
          <Space size={12}>
            <Button 
              icon={<CloseOutlined />} 
              onClick={handleCancel}
              size="large"
              style={{
                borderRadius: '8px',
                height: '42px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={loading}
              size="large"
              style={{
                borderRadius: '8px',
                height: '42px',
                paddingLeft: '28px',
                paddingRight: '28px',
                background: '#0000FF',
                border: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
            >
              {isEditMode ? 'Save Changes' : 'Create'}
            </Button>
          </Space>
        </div>
      }
      styles={{
        body: { 
          paddingTop: 32,
          paddingBottom: 24,
        },
        content: {
          borderRadius: '12px',
          overflow: 'hidden',
        }
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
            label={
              <Text strong style={{ fontSize: '14px', color: '#262626' }}>
                {label}
              </Text>
            }
            rules={rules}
            help={helpText}
            style={{ marginBottom: 24 }}
          >
            {inputType === 'number' ? (
              <InputNumber 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                }}
                controls
              />
            ) : inputType === 'password' ? (
              <Input.Password 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="new-password"
                style={{ borderRadius: '8px', height: '44px' }}
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
                style={{ borderRadius: '8px' }}
                popupMatchSelectWidth={false}
              />
            ) : inputType === 'date' ? (
              <DatePicker
                placeholder={placeholder || `Select ${label.toLowerCase()}`}
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  height: '44px',
                }}
                format="YYYY-MM-DD"
              />
            ) : inputType === 'email' ? (
              <Input 
                type="email" 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="email"
                style={{ borderRadius: '8px', height: '44px' }}
              />
            ) : (
              <Input 
                type={inputType} 
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                autoComplete="off"
                style={{ borderRadius: '8px', height: '44px' }}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default CreateModal;