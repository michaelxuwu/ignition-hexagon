import styled, { keyframes } from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex, SxStyleProp, Text } from 'rebass'
import useHover from '@lyra/common/hooks/useHover'
import { IGNITION_Z_INDEX } from '@/www/components/TokenLaunchSection/Hexagon'
import useIsMobile from '@lyra/common/hooks/useIsMobile'
import LinkWrapper from '@lyra/common/components/Link/LinkWrapper'

type Props = {
  title?: string
  hoverContent?: React.ReactNode | string
  progressPct: number
  inactive?: boolean
  waveColor: string
  waveColorSecondary: string
  delay?: number
  inverted?: boolean
  sector: 'upper' | 'lower'
  titlePosition?: 'centre' | 'high' | 'low'
  href?: string
}

const animate = (frameDelay: number) => keyframes`
  0% {
    transform: translate(-50%, 0) rotate(0deg);
  };
  ${50 + frameDelay}% {
    transform: translate(-50%, -1%) rotate(180deg);
  };
  100% {
    transform: translate(-50%, 0) rotate(360deg);
  };
`

const StyledTriangle = styled.div<{
  waveColor: string
  waveColorSecondary: string
  progressPct: number
  inverted: boolean
  delay: number
  height: number
}>`
  position: relative;
  overflow: hidden;
  clip-path: ${props => (props.inverted ? 'polygon(50% 100%, 0 0, 100% 0)' : 'polygon(50% 0%, 0% 100%, 100% 100%)')};
  width: 100%;
  height: ${props => props.height}px;
  background: linear-gradient(
    0deg,
    ${props => props.waveColor + '80'} 0%,
    ${props => props.waveColor + '12'} ${props => props.progressPct + '%'},
    rgba(0, 212, 255, 0) ${props => props.progressPct + 10 + '%'}
  );
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 50%;
    width: 200vw;
    height: 200vw;
    min-width: 800px;
    min-height: 800px;
    animation: ${props => animate(props.delay)} 10s infinite linear;
  }

  &:before {
    top: ${props => 92 - props.progressPct + '%'};
    border-radius: 50%;
    animation-duration: 18s;
    background-color: ${props => props.waveColorSecondary};
    box-shadow: 0px 0px 10px 5px ${props => props.waveColorSecondary + '80'};
    opacity: ${props => props.progressPct / 100};
  }

  &:after {
    top: ${props => 95 - props.progressPct + '%'};
    border-radius: 49%;
    animation-duration: 16s;
    background-color: ${props => props.waveColor};
    box-shadow: 0px 0px 10px 5px ${props => props.waveColor + '80'};
    opacity: ${props => props.progressPct / 100};
  }
`

const triangleSx = (inverted: boolean): SxStyleProp => ({
  width: '100%',
  clipPath: inverted ? 'polygon(50% 100%, 0 0, 100% 0)' : 'polygon(50% 0%, 0% 100%, 100% 100%)',
})

const contentTransitionIn = 'all .25s ease-out'

const scaleHoverContent = (inverted: boolean) => ({
  transform: 'scale(0.9)',
  '@media screen and (max-height: 800px)': {
    transform: 'scale(0.8)',
    top: inverted ? '5%' : '25%',
  },
  '@media screen and (max-height: 740px)': {
    transform: 'scale(0.7)',
  },
})

export default function HexagonTriangle({
  delay = 0,
  hoverContent,
  inverted = false,
  progressPct,
  title,
  titlePosition = 'centre',
  sector,
  waveColor,
  waveColorSecondary,
  href,
  inactive,
}: Props) {
  const [hoverRef, isHovered] = useHover()
  const boxRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [triangleHeight, setTriangleHeight] = useState(0)
  useEffect(() => {
    const ref = boxRef.current
    if (ref) {
      setTriangleHeight(Math.round((ref.offsetWidth * 1.725) / 2))
    }
  }, [boxRef.current?.offsetWidth])

  const titlePlacement = () => {
    if (titlePosition === 'high') {
      return '33%'
    } else if (titlePosition === 'low') {
      return '66%'
    }

    switch (sector) {
      case 'upper':
        return '60%'
      case 'lower':
        return '40%'
    }
  }

  return (
    <LinkWrapper href={href} target="_blank">
      <Box ref={boxRef} sx={{ position: 'relative', width: '100%' }}>
        <Box
          ref={hoverRef}
          sx={{
            ...triangleSx(inverted),
            height: triangleHeight,
            position: 'absolute',
            top: '0',
            zIndex: IGNITION_Z_INDEX.mouseEvent,
            pointerEvents: isMobile ? 'none' : 'all',
          }}
        >
          <Flex
            sx={{
              width: '100%',
              position: 'absolute',
              top: inverted ? '10%' : '37.5%',
              opacity: isHovered ? 1 : 0,
              transition: contentTransitionIn,
              ...scaleHoverContent(inverted),
            }}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {hoverContent}
          </Flex>
        </Box>
        <Box
          sx={{
            ...triangleSx(inverted),
            height: triangleHeight,
            background: 'linear-gradient(180deg, #1c1c1c59 19.11%, rgba(119,127,135,0) 100%)',
            width: '100%',
          }}
        >
          <Box sx={{ visibility: isHovered ? 'hidden' : null, width: '100%' }}>
            <StyledTriangle
              waveColor={waveColor}
              progressPct={progressPct}
              inverted={inverted}
              waveColorSecondary={waveColorSecondary}
              delay={delay}
              height={triangleHeight}
            />
          </Box>
        </Box>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            ...triangleSx(inverted),
            height: triangleHeight,
            position: 'absolute',
            top: '0',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: isHovered
                ? `linear-gradient(
              0deg,
              ${waveColor} 0%,
              ${waveColor + '99'} ${progressPct - 5 + '%'},
              rgba(0, 212, 255, 0) ${progressPct + 10 + '%'}
            )`
                : null,
              opacity: isHovered ? 1 : 0,
              transition: contentTransitionIn,
              backdropFilter: 'blur(15px)',
            }}
          >
            <Flex
              sx={{
                ...triangleSx(inverted),
                height: triangleHeight,
                background: 'linear-gradient(180deg, rgba(26, 28, 30, 0.4) 24%, rgba(21, 23, 26) 100%)',
                position: 'relative',
                opacity: isHovered ? 1 : 0,
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: titlePlacement(),
              transform: 'translate(0, -50%)',
              opacity: isHovered ? 0 : 1,
              transition: 'all 0.15s ease-out',
            }}
          >
            <Text variant="title" color={inactive ? 'secondaryText' : 'white'}>
              {title}
            </Text>
          </Box>
        </Flex>
      </Box>
    </LinkWrapper>
  )
}
