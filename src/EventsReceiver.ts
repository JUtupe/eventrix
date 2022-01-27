import {
    EmitI,
    EventsReceiverI,
    FetchMethodI,
    ReceiverI,
    StateManagerI,
    FetchHandlersI,
    ReceiverStatePathI,
    FetchStateStatus,
    FetchStateMethodI,
} from './interfaces';

class EventsReceiver<EventData = any, ReceiverResponse = any | Promise<any>> implements EventsReceiverI {
    eventsNames: string[];
    receiver: ReceiverI;

    constructor(eventsNames: string | string[], receiver: ReceiverI<EventData, ReceiverResponse>) {
        this.eventsNames = Array.isArray(eventsNames) ? eventsNames : [eventsNames];
        this.receiver = receiver;
    }
    getEventsNames(): string[] {
        return this.eventsNames;
    }
    handleEvent<EventData, ReceiverResponse>(name: string, data: EventData, stateManager: StateManagerI): ReceiverResponse {
        return this.receiver(name, data, stateManager);
    }
}

export const fetchHandler = <ResponseDataI>(fetchMethod: FetchMethodI, { success, error }: FetchHandlersI<ResponseDataI>) => {
    return (eventData: any, state: any, emit: EmitI<ResponseDataI>): Promise<ResponseDataI> =>
        fetchMethod(eventData, state, emit)
            .then((response) => {
                const { eventName, data, getData } = success;
                const successEventData = getData && typeof getData === 'function' ? getData(response, eventData) : data;
                emit(eventName, successEventData);
                return response;
            })
            .catch((errorResponse) => {
                const { eventName, data, getData } = error;
                const errorEventData = getData && typeof getData === 'function' ? getData(errorResponse, eventData) : data;
                emit(eventName, errorEventData);
            });
};

export const fetchToStateReceiver = (
    eventName: string | string[],
    statePath: string | ReceiverStatePathI,
    fetchMethod: FetchMethodI,
): EventsReceiverI => {
    return new EventsReceiver(eventName, (name, eventData, stateManager: StateManagerI) => {
        const state = stateManager.getState();
        const emit = stateManager.eventsEmitter.emit;
        return fetchMethod(eventData, state, emit).then((nextState) => {
            if (nextState !== undefined) {
                const path = typeof statePath === 'function' ? statePath(eventData, nextState) : statePath;
                stateManager.setState(path, nextState);
                return nextState;
            }
        });
    });
};

export const fetchStateReceiver = <FetchParamsI = any, FetchResponseI = any>(
    stateName: string,
    fetchMethod: FetchStateMethodI<FetchParamsI, FetchResponseI>,
): EventsReceiverI => {
    return new EventsReceiver(`fetchState:${stateName}`, (name, eventData, stateManager: StateManagerI) => {
        const data = stateManager.getState<FetchResponseI>(`${stateName}.data`);
        stateManager.setState(stateName, {
            data,
            isLoading: true,
            isSuccess: false,
            isError: false,
            status: FetchStateStatus.Loading,
        });
        return fetchMethod(eventData)
            .then((nextState) => {
                if (nextState !== undefined) {
                    stateManager.setState(stateName, {
                        data: nextState,
                        isLoading: false,
                        isSuccess: true,
                        isError: false,
                        status: FetchStateStatus.Success,
                    });
                    return nextState;
                }
            })
            .catch((error) => {
                if (error) {
                    stateManager.setState(stateName, {
                        data,
                        isLoading: false,
                        isSuccess: false,
                        isError: true,
                        error: {
                            message: error.message,
                        },
                        status: FetchStateStatus.Error,
                    });
                }
            });
    });
};

export default EventsReceiver;
