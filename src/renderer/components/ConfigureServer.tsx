// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import classNames from 'classnames';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { MODAL_TRANSITION_TIMEOUT, SPLASH_GIF_TIMEOUT, URLValidationStatus } from 'common/utils/constants';
import DarkSplash from 'renderer/assets/DarkSplash.gif';
import LightSplash from 'renderer/assets/LightSplash.gif';
import Logo from 'renderer/assets/Logo.png';
import womanLaptop from 'renderer/assets/svg/womanLaptop.svg';
import Input, { STATUS, SIZE } from 'renderer/components/Input';
import LoadingBackground from 'renderer/components/LoadingScreen/LoadingBackground';
import SaveButton from 'renderer/components/SaveButton/SaveButton';

import type { UniqueServer } from 'types/config';

import 'renderer/css/components/Button.scss';
import 'renderer/css/components/ConfigureServer.scss';
import 'renderer/css/components/LoadingScreen.css';

type ConfigureServerProps = {
    server?: UniqueServer;
    mobileView?: boolean;
    darkMode?: boolean;
    messageTitle?: string;
    messageSubtitle?: string;
    cardTitle?: string;
    alternateLinkMessage?: string;
    alternateLinkText?: string;
    alternateLinkURL?: string;
    onConnect: (data: UniqueServer) => void;
};

function ConfigureServer({
    server,
    mobileView,
    darkMode,
    messageTitle,
    messageSubtitle,
    cardTitle,
    alternateLinkMessage,
    alternateLinkText,
    alternateLinkURL,
    onConnect,
}: ConfigureServerProps) {
    const { formatMessage } = useIntl();

    const {
        name: prevName,
        url: prevURL,
        id,
    } = server || {};

    const mounted = useRef(false);
    const [transition, setTransition] = useState<'inFromRight' | 'outToLeft'>();
    const [name, setName] = useState(prevName || '');
    const [url, setUrl] = useState(prevURL || '');
    const [nameError, setNameError] = useState('');
    const [urlError, setURLError] = useState<{ type: STATUS; value: string }>();
    const [showContent, setShowContent] = useState(false);
    const [showGif, setShowGif] = useState(true);
    const [waiting, setWaiting] = useState(false);

    const [validating, setValidating] = useState(false);
    const validationTimestamp = useRef<number>();
    const validationTimeout = useRef<NodeJS.Timeout>();
    const editing = useRef(false);

    const canSave = name && url && !nameError && !validating && urlError && urlError.type !== STATUS.ERROR;

    useEffect(() => {
        if (showGif) {
            return undefined;
        }
        setTransition('inFromRight');
        setShowContent(true);
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, [showGif]);

    useEffect(() => {
        setTimeout(() => {
            setShowGif(false);
        }, SPLASH_GIF_TIMEOUT);
    }, []);

    const fetchValidationResult = (urlToValidate: string) => {
        setValidating(true);
        setURLError({
            type: STATUS.INFO,
            value: formatMessage({ id: 'renderer.components.configureServer.url.validating', defaultMessage: 'Validating...' }),
        });
        const requestTime = Date.now();
        validationTimestamp.current = requestTime;
        validateURL(urlToValidate).then(({ validatedURL, serverName, message }) => {
            if (editing.current) {
                setValidating(false);
                setURLError(undefined);
                return;
            }
            if (!validationTimestamp.current || requestTime < validationTimestamp.current) {
                return;
            }
            if (validatedURL) {
                setUrl(validatedURL);
            }
            if (serverName) {
                setName((prev) => {
                    return prev.length ? prev : serverName;
                });
            }
            if (message) {
                setTransition(undefined);
                setURLError(message);
            }
            setValidating(false);
        });
    };

    const validateName = () => {
        const newName = name.trim();

        if (!newName) {
            return formatMessage({
                id: 'renderer.components.newServerModal.error.nameRequired',
                defaultMessage: 'Name is required.',
            });
        }

        return '';
    };

    const validateURL = async (url: string) => {
        let message;
        const validationResult = await window.desktop.validateServerURL(url);

        if (validationResult?.status === URLValidationStatus.Missing) {
            message = {
                type: STATUS.ERROR,
                value: formatMessage({
                    id: 'renderer.components.newServerModal.error.urlRequired',
                    defaultMessage: 'URL is required.',
                }),
            };
        }

        if (validationResult?.status === URLValidationStatus.Invalid) {
            message = {
                type: STATUS.ERROR,
                value: formatMessage({
                    id: 'renderer.components.newServerModal.error.urlIncorrectFormatting',
                    defaultMessage: 'URL is not formatted correctly.',
                }),
            };
        }

        // if (validationResult?.status === URLValidationStatus.Insecure) {
        //     message = {
        //         type: STATUS.WARNING,
        //         value: formatMessage({id: 'renderer.components.configureServer.url.insecure', defaultMessage: 'Your server URL is potentially insecure. For best results, use a URL with the HTTPS protocol.'}),
        //     };
        // }

        // if (validationResult?.status === URLValidationStatus.NotMattermost) {
        //     message = {
        //         type: STATUS.WARNING,
        //         value: formatMessage({id: 'renderer.components.configureServer.url.notMattermost', defaultMessage: 'The server URL provided does not appear to point to a valid X9 server. Please verify the URL and check your connection.'}),
        //     };
        // }

        // if (validationResult?.status === URLValidationStatus.URLNotMatched) {
        //     message = {
        //         type: STATUS.WARNING,
        //         value: formatMessage({id: 'renderer.components.configureServer.url.urlNotMatched', defaultMessage: 'The server URL provided does not match the configured Site URL on your X9 server. Server version: {serverVersion}'}, {serverVersion: validationResult.serverVersion}),
        //     };
        // }

        // if (validationResult?.status === URLValidationStatus.URLUpdated) {
        //     message = {
        //         type: STATUS.INFO,
        //         value: formatMessage({id: 'renderer.components.configureServer.url.urlUpdated', defaultMessage: 'The server URL provided has been updated to match the configured Site URL on your X9 server. Server version: {serverVersion}'}, {serverVersion: validationResult.serverVersion}),
        //     };
        // }

        if (validationResult?.status === URLValidationStatus.OK) {
            message = {
                type: STATUS.SUCCESS,
                value: formatMessage({ id: 'renderer.components.configureServer.url.ok', defaultMessage: 'Server URL is valid. Server version: {serverVersion}' }, { serverVersion: validationResult.serverVersion }),
            };
        }

        if (!message) {
            message = {
                type: STATUS.INFO,
                value: formatMessage({ id: 'renderer.components.configureServer.url.info', defaultMessage: 'The URL of your X9 server' }),
            }
        }

        return {
            validatedURL: validationResult.validatedURL,
            serverName: validationResult.serverName,
            message,
        };
    };

    const handleNameOnChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setName(value);

        if (nameError) {
            setNameError('');
        }
    };

    const handleURLOnChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(value);

        if (urlError) {
            setURLError(undefined);
        }

        editing.current = true;
        clearTimeout(validationTimeout.current as unknown as number);
        validationTimeout.current = setTimeout(() => {
            if (!mounted.current) {
                return;
            }
            editing.current = false;
            fetchValidationResult(value);
        }, 1000);
    };

    const handleOnSaveButtonClick = (e: React.MouseEvent) => {
        submit(e);
    };

    const handleOnCardEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submit(e);
        }
    };

    const submit = async (e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();

        if (!canSave || waiting) {
            return;
        }

        setWaiting(true);

        const nameError = validateName();

        if (nameError) {
            setTransition(undefined);
            setNameError(nameError);
            setWaiting(false);
            return;
        }

        setTransition('outToLeft');

        setTimeout(() => {
            onConnect({
                url,
                name,
                id,
            });
        }, MODAL_TRANSITION_TIMEOUT);
    };

    const getAlternateLink = useCallback(() => {
        if (!alternateLinkURL || !alternateLinkMessage || !alternateLinkText) {
            return undefined;
        }

        return (
            <div className={classNames('alternate-link', transition, {'alternate-link-inverted': darkMode})}>
                <span className='alternate-link__message'>
                    {alternateLinkMessage}
                </span>
                <a
                    className={classNames(
                        'link-button link-small-button alternate-link__link',
                        {'link-button-inverted': darkMode},
                    )}
                    href={alternateLinkURL}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {alternateLinkText}
                </a>
            </div>
        );
    }, [transition, darkMode, alternateLinkURL, alternateLinkMessage, alternateLinkText]);

    return (
        <div
            className={classNames(
                'LoadingScreen',
                {'LoadingScreen--darkMode': darkMode},
                'ConfigureServer',
                {'ConfigureServer-inverted': darkMode},
            )}
        >
            <LoadingBackground/>
            {showGif ? (
                <img
                    src={darkMode ? DarkSplash : LightSplash}
                    className='LoadingScreen--splash'
                />
            ) : null}
            {showContent ? (
                <div className='ConfigureServer__body'>
                    {!mobileView && getAlternateLink()}
                    <div className='ConfigureServer__content'>
                        <div className={classNames('ConfigureServer__card', transition, {'with-error': nameError || urlError?.type === STATUS.ERROR})}>
                            <img
                                src={Logo}
                                className='ConfigureServer__logo'
                            />
                            <div
                                className='ConfigureServer__card-content'
                                onKeyDown={handleOnCardEnterKeyDown}
                                tabIndex={0}
                            >
                                <p className='ConfigureServer__card-title'>
                                    {cardTitle || formatMessage({id: 'renderer.components.configureServer.cardtitle', defaultMessage: 'Enter your server details'})}
                                </p>
                                <div className='ConfigureServer__card-form'>
                                    <Input
                                        name='url'
                                        className='ConfigureServer__card-form-input'
                                        type='text'
                                        inputSize={SIZE.LARGE}
                                        value={url}
                                        onChange={handleURLOnChange}
                                        customMessage={urlError ?? ({
                                            type: STATUS.INFO,
                                            value: formatMessage({id: 'renderer.components.configureServer.url.info', defaultMessage: 'The URL of your X9 server'}),
                                        })}
                                        placeholder={formatMessage({id: 'renderer.components.configureServer.url.placeholder', defaultMessage: 'Server URL'})}
                                        disabled={waiting}
                                        darkMode={darkMode}
                                    />
                                    <Input
                                        name='name'
                                        className='ConfigureServer__card-form-input'
                                        containerClassName='ConfigureServer__card-form-input-container'
                                        type='text'
                                        inputSize={SIZE.LARGE}
                                        value={name}
                                        onChange={handleNameOnChange}
                                        customMessage={nameError ? ({
                                            type: STATUS.ERROR,
                                            value: nameError,
                                        }) : ({
                                            type: STATUS.INFO,
                                            value: formatMessage({id: 'renderer.components.configureServer.name.info', defaultMessage: 'The name that will be displayed in your server list'}),
                                        })}
                                        placeholder={formatMessage({id: 'renderer.components.configureServer.name.placeholder', defaultMessage: 'Server display name'})}
                                        disabled={waiting}
                                        darkMode={darkMode}
                                    />
                                    <SaveButton
                                        id='connectConfigureServer'
                                        extraClasses='ConfigureServer__card-form-button'
                                        saving={waiting}
                                        onClick={handleOnSaveButtonClick}
                                        defaultMessage={formatMessage({id: 'renderer.components.configureServer.connect.default', defaultMessage: 'Connect'})
                                        }
                                        savingMessage={formatMessage({id: 'renderer.components.configureServer.connect.saving', defaultMessage: 'Connecting…'})}
                                        disabled={!canSave}
                                        darkMode={darkMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className='ConfigureServer__footer'/>
        </div>
    );
}

export default ConfigureServer;
