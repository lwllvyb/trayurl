import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout, Result } from 'antd'

const { Header, Content } = Layout

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 只有在浏览器环境中才执行
    if (typeof window !== 'undefined') {
      // 处理尺寸变化的函数
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
      
      // 立即触发一次，以获取初始尺寸
      handleResize();

      // 组件卸载时移除事件监听器
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // 空数组保证效果只在挂载和卸载时运行

  return windowSize;
}

const AutoRefreshIframe = ({ src, width, height }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [iframeKey, setIframeKey] = useState(0);

  // 每当窗口大小发生变化时，更新 iframe 的 key
  useEffect(() => {
    setIframeKey(prevKey => prevKey + 1);
  }, [windowWidth, windowHeight]); // 依赖窗口宽度和高度

  return (
    <iframe
      key={iframeKey} // 使用 key 来控制重绘
      src={src}
      width={width}
      height={height}
      frameBorder="0"
    />
  );
};

export default function JuchatsPage() {
  const { width, height } = useWindowSize();
  console.log(width, height)
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-ant-design)</title>
      </Head>

      <Header>
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </Header>

      <Content >
      <AutoRefreshIframe
        src="https://www.juchats.com/chat"
        width="600"
        height="400"
      />
      
      </Content>
    </React.Fragment>
  )
}
