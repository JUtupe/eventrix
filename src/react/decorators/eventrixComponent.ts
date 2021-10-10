import * as React from 'react';
import { EventrixContext } from '../context';
import { DecoratorEventrixListenerI, DecoratorEventrixStateI, EventrixContextI } from '../../interfaces';

function eventrixComponent(Class: React.ComponentClass): any {
    const originComponentDidMount = Class.prototype.componentDidMount;
    const originComponentWillUnmount = Class.prototype.componentWillUnmount;

    Class.prototype.componentDidMount = function (...args: any[]): void {
        if (Array.isArray(this.eventrixListeners)) {
            this.eventrixListeners.forEach(({ eventName, name }: DecoratorEventrixListenerI): void => {
                this.eventrix.listen(eventName, this[name]);
            });
        }
        if (originComponentDidMount) {
            originComponentDidMount.apply(this, ...args);
        }
    };

    Class.prototype.componentWillUnmount = function (...args: any[]): void {
        if (Array.isArray(this.eventrixListeners)) {
            this.eventrixListeners.forEach(({ eventName, name }: DecoratorEventrixListenerI): void => {
                this.eventrix.unlisten(eventName, this[name]);
            });
        }
        if (originComponentWillUnmount) {
            originComponentWillUnmount.apply(this, ...args);
        }
    };
    Class.contextType = EventrixContext;
    return class extends Class {
        constructor(props: any, context: EventrixContextI) {
            super(props, context);
            /*@ts-ignore*/
            this.eventrix = context.eventrix;
            /*@ts-ignore*/
            if (Array.isArray(this.eventrixListeners)) {
                /*@ts-ignore*/
                this.eventrixListeners.forEach(({ name }: DecoratorEventrixListenerI): void => {
                    /*@ts-ignore*/
                    this[name] = this[name].bind(this);
                });
            }
            /*@ts-ignore*/
            if (Array.isArray(this.eventrixStates)) {
                if (!this.state) {
                    this.state = {};
                }
                /*@ts-ignore*/
                this.eventrixStates.forEach(({ statePath, stateName }: DecoratorEventrixStateI): void => {
                    /*@ts-ignore*/
                    this.state[stateName] = this.eventrix.getState(statePath);
                });
            }
        }
    };
}

export default eventrixComponent;
