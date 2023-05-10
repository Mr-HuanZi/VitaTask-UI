import React from 'react';
import { Image } from 'antd';
import type { ImageProps } from 'rc-image';
import styles from './index.less';

interface SquareImagePropsI {
  size?: number;
}

/**
 * 正方形外框图片组件
 * 可以搭配 Image.PreviewGroup 组件使用
 * @param props
 * @constructor
 */
const SquareImage: React.FC<SquareImagePropsI & ImageProps> = (props) => {
  const { size = 105 } = props;

  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className={styles.wrap}>
      <Image
        {...props}
        style={{ ...props.style, objectFit: 'contain' }}
        width={`${size - 12}px`}
        height={`${size - 10}px`}
      />
    </div>
  );
};

export default SquareImage;
