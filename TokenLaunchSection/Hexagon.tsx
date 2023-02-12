import React, { useEffect, useState } from 'react'
import { Box, Flex, Link, Text } from 'rebass'
import LogoUnfilled from '@/www/components/TokenLaunchSection/LogoUnfilled'
import HexagonTriangle from './HexagonTriangle'
import HexagonSVG from '@/www/components/TokenLaunchSection/HexagonSVG'
import useThemeColor from '@lyra/common/hooks/useThemeColor'
import LogoHexagonUnfilled from '@/www/components/TokenLaunchSection/LogoHexagonUnfilled'
import LogoHexagonFilled from '@/www/components/TokenLaunchSection/LogoHexagonFilled'
import styled, { keyframes } from 'styled-components'
import LogoFilled from '@/www/components/TokenLaunchSection/LogoFilled'
import { MarginProps, LayoutProps, FlexGrowProps } from 'styled-system'
import useWindowSize from '@lyra/common/hooks/useWindowSize'
import Logo from '@lyra/common/components/Logo'
import Countdown from '@lyra/common/components/Countdown'
import {
  ROUND_1_START_TIMESTAMP,
  ROUND_1_END_TIMESTAMP,
  ROUND_2_START_TIMESTAMP,
  ROUND_3_START_TIMESTAMP,
  SECURITY_MODULE_END_TIMESTAMP,
  SECURITY_MODULE_START_TIMESTAMP,
  ROUND_2_END_TIMESTAMP,
} from '@lyra/common/constants'

// hexagon width / height
const ASPECT_RATIO = '1.15 / 1'

export const IGNITION_Z_INDEX = {
  default: 1,
  unfilled: 2,
  filled: 3,
  mouseEvent: 4,
}

const TRIANGLE_WIDTH = '49.4%'
const TRIANGLE_MARGIN_MIDDLE = '2px'

const middleAnimation = (totalProgress: number) => {
  const basis = totalProgress > 8.6 ? totalProgress : totalProgress + 8.6
  return `
    ${basis}% { 
      opacity: 1;
    }
    
    ${basis + 1}% { 
      opacity: 0;
    }
    
    ${basis + 2}% { 
      opacity: 0.6;
    }
    
    ${basis + 3}% {
      opacity: 0;
    }`
}

const animate = (totalProgress: number) => keyframes`
	0% {
		opacity: 0;
	}

	1.5% {
		opacity: 1.3;
	}
	
	2.8% {
	  opacity: ${totalProgress / 100}
	}
	
	4.6% {
	  opacity: 1;
	}
	
	5.9% {
	  opacity: 0.9
	}

	8.6% {
		opacity: 1.37;
	}

	${totalProgress > 88.4 ? `${totalProgress}% {opacity: 1}` : middleAnimation(totalProgress)} 
  
	100% { 
	  opacity: 0;
	}
`

const FlickerContainer = styled.div<{ width: string; totalProgress: number; transform: string }>`
  opacity: 1;
  z-index: ${IGNITION_Z_INDEX.filled};
  animation: ${props => (props.totalProgress < 100 ? animate(props.totalProgress) : null)} 15s infinite
    cubic-bezier(0.45, 0, 0.55, 1);
  width: ${props => props.width};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${props => props.transform};
`

type Props = MarginProps & LayoutProps & FlexGrowProps

const LP1_DURATION = 30 * 24 * 60 * 60
const S1_DURATION = SECURITY_MODULE_END_TIMESTAMP - SECURITY_MODULE_START_TIMESTAMP
const T1_DURATION = ROUND_1_END_TIMESTAMP - ROUND_1_START_TIMESTAMP
const LP2_DURATION = T1_DURATION
const T2_DURATION = ROUND_2_END_TIMESTAMP - ROUND_2_START_TIMESTAMP
const LP3_DURATION = T2_DURATION

const getProgressPercentage = (progress: number) => (progress === 0 ? 0 : ((progress + 0.2) / 1.5) * 100)

export default function Hexagon({ ...styleProps }: Props) {
  const primary = useThemeColor('primary')
  const primaryDark = useThemeColor('primaryDark')
  const waveColors = [primary, primaryDark, primary, primaryDark, primary, primaryDark]
  const waveColorsAlternate = [primaryDark, primary, primaryDark, primary, primaryDark, primary]
  // L ->  R top row

  const [timestamp, setTimestamp] = useState(Date.now() / 1000)
  useEffect(() => {
    const i = setInterval(() => {
      setTimestamp(Date.now() / 1000)
    }, 1000 * 30)
    return () => clearInterval(i)
  }, [])

  const timeToLP1End = Math.max(0, ROUND_1_START_TIMESTAMP - timestamp)
  const timeToS1End = Math.max(0, SECURITY_MODULE_END_TIMESTAMP - timestamp)
  const timeToT1End = Math.max(0, ROUND_1_END_TIMESTAMP - timestamp)
  const timeToLP2End = Math.max(0, ROUND_2_START_TIMESTAMP - timestamp)
  const timeToT2End = Math.max(0, ROUND_2_END_TIMESTAMP - timestamp)
  const timeToLP3End = Math.max(0, ROUND_3_START_TIMESTAMP - timestamp)
  // HACK: set min to 0.2 (20%) to render progress when active
  const S1Progress = Math.max(0.2, (S1_DURATION - timeToS1End) / S1_DURATION)
  const LP1Progress = Math.max(0, (LP1_DURATION - timeToLP1End) / LP1_DURATION)
  const LP2Progress = Math.max(
    0,
    (LP2_DURATION - timeToLP2End) / LP2_DURATION >= 1 ? 1 : Math.min((LP2_DURATION - timeToLP2End) / LP2_DURATION, 0.6)
  )
  const LP3Progress = Math.max(0, (LP3_DURATION - timeToLP3End) / LP3_DURATION)
  const T1Progress = Math.max(0.1, (T1_DURATION - timeToT1End) / T1_DURATION)
  const T2Progress = Math.max(0, (T2_DURATION - timeToT2End) / T2_DURATION)
  const totalProgress = (100 * (LP1Progress + LP2Progress + LP3Progress + T1Progress + T2Progress + S1Progress)) / 6

  const [_width, _height] = useWindowSize()
  return (
    <Flex
      {...styleProps}
      sx={{ aspectRatio: ASPECT_RATIO, maxWidth: '90vw', maxHeight: '70vh' }}
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ position: 'relative', width: '100%' }}>
        <HexagonSVG />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '25%',
            height: '25%',
            zIndex: IGNITION_Z_INDEX.unfilled,
          }}
        >
          <Box
            sx={{
              width: '130%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: IGNITION_Z_INDEX.unfilled,
            }}
          >
            <LogoHexagonUnfilled />
          </Box>
          <FlickerContainer width="166%" totalProgress={totalProgress} transform="translate(-50%, -50%)">
            <LogoHexagonFilled />
          </FlickerContainer>
          <Box
            sx={{
              width: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-55%, -55%)',
              zIndex: IGNITION_Z_INDEX.unfilled,
            }}
          >
            <LogoUnfilled />
          </Box>
          <FlickerContainer width="55%" totalProgress={totalProgress} transform="translate(-55%, -55%)">
            <LogoFilled />
          </FlickerContainer>
        </Box>
        <Box
          sx={{
            top: `5.9%`,
            left: `5.9%`,
            position: 'absolute',
            width: '88.6%',
            height: '43%',
          }}
          flexDirection="column"
        >
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <Box sx={{ width: TRIANGLE_WIDTH, height: '100%', position: 'absolute', top: 0 }}>
              <HexagonTriangle
                inactive={LP3Progress > 0 ? false : true}
                title="LP3"
                sector="upper"
                progressPct={getProgressPercentage(LP3Progress)}
                waveColor={waveColors[0]}
                waveColorSecondary={waveColorsAlternate[0]}
                href="https://app.lyra.finance/pools/eth"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">LP Round 3</Text>
                    <Text mt={2} variant="title">
                      12.0m <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Deposit sUSD to earn Lyra rewards
                    </Text>
                    {timeToLP3End > 0 ? (
                      <Link as="p" href="https://app.lyra.finance/pools/eth" target="_blank">
                        Deposit Now →
                      </Link>
                    ) : timeToLP3End >= 1 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Countdown variant="primaryBody" timestamp={ROUND_3_START_TIMESTAMP} />
                    )}
                  </Flex>
                }
              />
            </Box>
            <Box
              sx={{
                width: TRIANGLE_WIDTH,
                marginLeft: TRIANGLE_MARGIN_MIDDLE,
                height: '100%',
                position: 'absolute',
                top: 0,
                left: '25%',
              }}
            >
              <HexagonTriangle
                progressPct={getProgressPercentage(S1Progress)}
                inverted={true}
                title="S1"
                sector="upper"
                titlePosition="high"
                waveColor={waveColors[1]}
                waveColorSecondary={waveColorsAlternate[1]}
                delay={10}
                href="https://app.lyra.finance/pools/security/usdc"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">Security Module</Text>
                    <Text mt={2} variant="title">
                      5.0m <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Deposit USDC to earn Lyra rewards on L1
                    </Text>
                    {S1Progress >= 1 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Link as="p" href="https://app.lyra.finance/pools/security/usdc" target="_blank">
                        Deposit Now →
                      </Link>
                    )}
                  </Flex>
                }
              />
            </Box>
            <Box
              sx={{
                width: TRIANGLE_WIDTH,
                marginLeft: TRIANGLE_MARGIN_MIDDLE,
                position: 'absolute',
                top: 0,
                left: '50%',
              }}
            >
              <HexagonTriangle
                title="LP1"
                sector="upper"
                progressPct={getProgressPercentage(LP1Progress)}
                waveColor={waveColors[2]}
                waveColorSecondary={waveColorsAlternate[2]}
                href="https://app.lyra.finance/pools/eth"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">LP Round 1</Text>
                    <Text mt={2} variant="title">
                      6.0m <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Deposit sUSD to earn Lyra rewards
                    </Text>
                    {LP1Progress >= 1 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Link as="p" href="https://app.lyra.finance/pools/eth" target="_blank">
                        Deposit Now →
                      </Link>
                    )}
                  </Flex>
                }
              />
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: '100%', position: 'relative', top: '3%' }}>
            <Box sx={{ width: TRIANGLE_WIDTH, height: '100%', position: 'absolute', top: 0 }}>
              <HexagonTriangle
                inactive={T2Progress > 0 ? false : true}
                title="T2"
                sector="lower"
                progressPct={getProgressPercentage(T2Progress)}
                inverted={true}
                waveColor={waveColors[3]}
                waveColorSecondary={waveColorsAlternate[3]}
                delay={-10}
                href="https://app.lyra.finance/trade/eth"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">Trading Round 2</Text>
                    <Text mt={2} variant="title">
                      1.2m <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Earn Lyra rewards on trading fees
                    </Text>
                    {timeToT2End > 0 ? (
                      <Link as="p" href="https://app.lyra.finance/trade/eth" target="_blank">
                        Trade Now →
                      </Link>
                    ) : timeToT2End <= 0 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Countdown variant="primaryBody" timestamp={ROUND_2_START_TIMESTAMP} />
                    )}
                  </Flex>
                }
              />
            </Box>
            <Box
              sx={{
                width: TRIANGLE_WIDTH,
                height: '100%',
                marginLeft: TRIANGLE_MARGIN_MIDDLE,
                position: 'absolute',
                top: 0,
                left: '25%',
              }}
            >
              <HexagonTriangle
                title="LP2"
                sector="lower"
                titlePosition="low"
                progressPct={getProgressPercentage(LP2Progress)}
                waveColor={waveColors[4]}
                waveColorSecondary={waveColorsAlternate[4]}
                delay={15}
                href="https://app.lyra.finance/pools/eth"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">LP Round 2</Text>
                    <Text mt={2} variant="title">
                      9.0m <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Deposit sUSD to earn Lyra rewards
                    </Text>
                    {timeToLP2End > 0 ? (
                      <Link as="p" href="https://app.lyra.finance/pools/eth" target="_blank">
                        Deposit Now →
                      </Link>
                    ) : timeToLP2End <= 0 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Countdown variant="primaryBody" timestamp={ROUND_2_START_TIMESTAMP} />
                    )}
                  </Flex>
                }
              />
            </Box>
            <Box
              sx={{
                width: TRIANGLE_WIDTH,
                height: '100%',
                marginLeft: TRIANGLE_MARGIN_MIDDLE,
                position: 'absolute',
                top: 0,
                left: '50%',
              }}
            >
              <HexagonTriangle
                title="T1"
                sector="lower"
                progressPct={getProgressPercentage(T1Progress)}
                inverted={true}
                waveColor={waveColors[5]}
                waveColorSecondary={waveColorsAlternate[5]}
                delay={10}
                href="https://app.lyra.finance/trade/eth"
                hoverContent={
                  <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Text variant="secondary">Trading Round 1</Text>
                    <Text mt={2} variant="title">
                      800k <Logo size={20} />
                    </Text>
                    <Text my={2} sx={{ maxWidth: '60%', textAlign: 'center' }} variant="secondary">
                      Earn Lyra rewards on trading fees
                    </Text>
                    {T1Progress >= 1 ? (
                      <Text variant="primaryBody">Complete</Text>
                    ) : (
                      <Link as="p" href="https://app.lyra.finance/" target="_blank">
                        Trade Now →
                      </Link>
                    )}
                  </Flex>
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
