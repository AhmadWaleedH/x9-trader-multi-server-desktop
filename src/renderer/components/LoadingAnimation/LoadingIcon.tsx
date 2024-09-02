// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

/**
 * A function component for inlining SVG code for animation logo loader
 */
function LoadingAnimation() {
    return (
        <svg
            width='104'
            height='104'
            viewBox='0 0 104 104'
            xmlns='http://www.w3.org/2000/svg'
        >
            <defs>
                <linearGradient
                    id='LoadingAnimation__spinner-gradient'
                    x1='0%'
                    y1='72px'
                    x2='0%'
                    y2='32px'
                    gradientUnits='userSpaceOnUse'
                >
                    <stop
                        offset='0'
                        className='LoadingAnimation__spinner-gradient-color'
                        stopOpacity='1'
                    />
                    <stop
                        offset='1'
                        className='LoadingAnimation__spinner-gradient-color'
                        stopOpacity='0'
                    />
                </linearGradient>
                <mask id='LoadingAnimation__base-wipe-mask'>
                    <rect
                        x='0'
                        y='0'
                        width='104'
                        height='104'
                        fill='white'
                    />
                    <g className='LoadingAnimation__compass-base-mask-container'>
                        <circle
                            className='LoadingAnimation__compass-base-mask'
                            r='27'
                            cx='52'
                            cy='52'
                            fill='white'
                            stroke='black'
                            strokeWidth='54'
                        />
                    </g>
                </mask>
                <mask id='LoadingAnimation__base-mask'>
                    <rect
                        x='0'
                        y='0'
                        width='104'
                        height='104'
                        fill='white'
                    />
                    <circle
                        r='37'
                        cx='54'
                        cy='46'
                        fill='black'
                    />
                    <g className='LoadingAnimation__compass-needle-behind-mask'>
                        <g transform='translate(54,46)'>
                            <g transform='translate(-29, -61.3)'>
                                <path
                                    d='M38.5984 0C45.476 1.07762 51.9794 3.28918 57.9108 6.43722V61.1566C57.9108 77.1373 44.9364 90.1119 28.9554 90.1119C12.9744 90.1119 0 77.1373 0 61.1566C0 55.3848 1.69443 50.0063 4.60763 45.4861L38.5984 0Z'
                                    fill='black'
                                />
                            </g>
                        </g>
                    </g>
                    <g className='LoadingAnimation__compass-needle-front-mask'>
                        <g transform='translate(54,46)'>
                            <g transform='translate(-29,-61.3)'>
                                <path
                                    d='M38.5984 0C45.476 1.07762 51.9794 3.28918 57.9108 6.43722V61.1566C57.9108 77.1373 44.9364 90.1119 28.9554 90.1119C12.9744 90.1119 0 77.1373 0 61.1566C0 55.3848 1.69443 50.0063 4.60763 45.4861L38.5984 0Z'
                                    fill='black'
                                />
                            </g>
                        </g>
                    </g>
                </mask>
                <mask id='LoadingAnimation__spinner-left-half-mask'>
                    <rect
                        x='0'
                        y='0'
                        width='52'
                        height='104'
                        fill='white'
                    />
                    <circle
                        className='LoadingAnimation__spinner-mask'
                        r='20'
                        cx='52'
                        cy='52'
                        fill='black'
                    />
                </mask>
                <mask id='LoadingAnimation__spinner-right-half-mask'>
                    <rect
                        x='52'
                        y='0'
                        width='52'
                        height='104'
                        fill='white'
                    />
                    <circle
                        className='LoadingAnimation__spinner-mask'
                        r='20'
                        cx='52'
                        cy='52'
                        fill='black'
                    />
                </mask>
            </defs>
            <g
                className='LoadingAnimation__spinner-container'
            >
                <g className='LoadingAnimation__spinner'>
                    <circle
                        r='25'
                        cx='52'
                        cy='52'
                        fill='currentColor'
                        mask='url(#LoadingAnimation__spinner-left-half-mask)'
                    />
                    <circle
                        r='25'
                        cx='52'
                        cy='52'
                        fill='url(#LoadingAnimation__spinner-gradient)'
                        mask='url(#LoadingAnimation__spinner-right-half-mask)'
                    />
                </g>
            </g>
        </svg>
    );
}

export default LoadingAnimation;
