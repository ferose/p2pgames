import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../RootReducer';

/**
 * Turns the component conditional so if the player is in game the link opens in a new tab so game progress is not lost.
 * @param component
 */
export function makeConditionalLink(componentClass: typeof React.Component) {
    return connect((state:RootState) => {
        return {
            target: state.general.inGame ? "_blank" : "_self",
        }
    }, {})(componentClass) as any;
}

export const ConditionalLink = makeConditionalLink(Link) as typeof Link;