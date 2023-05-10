import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const defaultMessage = '張大歡提供技术支持';
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} />;
};

export default Footer;
