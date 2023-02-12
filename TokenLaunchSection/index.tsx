import React from 'react'
import { LayoutProps, PaddingProps } from 'styled-system'
import { Flex, Box, Link, Text } from 'rebass'
import Hexagon from './Hexagon'
import useIsMobile from '@lyra/common/hooks/useIsMobile'
import getPagePath from '@/www/utils/getPagePath'
import { WWWPageId } from '@/www/constants/pages'
import LinkWrapper from '@lyra/common/components/Link/LinkWrapper'
import { TOKENOMICS_DOCS_URL } from '@lyra/common/constants/external'

type Props = LayoutProps & PaddingProps

export default function TokenLaunchSection({ ...styleProps }: Props) {
  const isMobile = useIsMobile()
  return (
    <Flex {...styleProps} alignItems="center" justifyContent="center" flexDirection="column">
      <Text variant="largeTitle" textAlign="center">
        Ignition
      </Text>
      <Text maxWidth={600} variant="lightBody" textAlign="center">
        LYRA is launching on December 14th, 2021. Start earning now.
      </Text>
      <Hexagon flexGrow={1} />
      <Flex textAlign="center" flexDirection={isMobile ? 'column' : 'row'}>
        <Box mb={1} mx={6}>
          <LinkWrapper href={getPagePath({ page: WWWPageId.BecomeACitizen })}>
            <Link as="span" variant="headingLink">
              Become a citizen →
            </Link>
          </LinkWrapper>
        </Box>
        <Box mb={1} mx={6}>
          <Link variant="headingLink" href={TOKENOMICS_DOCS_URL} target="_blank">
            Tokenomics →
          </Link>
        </Box>
      </Flex>
    </Flex>
  )
}
