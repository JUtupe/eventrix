import * as React from 'react';
import { render } from '@testing-library/react';
import EventrixProvider from '../context/EventrixProvider';
import Eventrix from '../../Eventrix';
import useEventrix from './useEventrix';
import {EventrixI} from "../../interfaces";

interface PropsI {
    callback(eventrix: EventrixI): void;
}

describe('listener', () => {
    @useEventrix
    class ItemComponent extends React.Component<PropsI> {
        eventrix: EventrixI;
        render() {
            this.props.callback(this.eventrix);
            return (
                <div>
                    Test Item Component
                </div>
            );
        }
    }

    const TestContainer = ({ eventrix, children }) => (
        <EventrixProvider eventrix={eventrix}>
            {children}
        </EventrixProvider>
    );

    it('should use eventrix context and extend component by eventrix', () => {
        const eventrixInstance = new Eventrix({});
        const callbackMock = jest.fn();

        render(
            <TestContainer eventrix={eventrixInstance}>
                <ItemComponent callback={callbackMock} />
            </TestContainer>,
        );
        expect(callbackMock).toHaveBeenCalledWith(eventrixInstance);
    });
});
