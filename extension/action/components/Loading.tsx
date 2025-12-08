import { LoadingOutlined } from '@ant-design/icons';

import { Flex, Spin } from 'antd';


export default function Loading() {
    return (
        <Flex vertical justify='center' align='center' style={{ height: '100%' }}>
            <Flex justify='center'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </Flex>
        </Flex>
    )
}