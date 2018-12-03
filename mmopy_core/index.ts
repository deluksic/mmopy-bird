import _ from 'lodash';

export class BirdState {
    /** Position x in units */
    public x: number;
    /** Position y in units */
    public y: number;
    /** Speed in units/frame */
    public vspeed: number = 0;
    /** Frame number */
    public time: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Bird {
    public callsign: string;
    constructor(callsign: string) {
        this.callsign = callsign;
    }
}

export class Simulation {
    public startX: number = 0;
    public startY: number = 100;
    public hspeed: number = 5;
    public jumpSpeed: number = 10;
    public gravity: number = -1;
    public ceiling: number = 200;
    public seed: number;
    public bird: Bird;
    public states: BirdState[];

    constructor(bird: Bird, seed: number) {
        this.bird = bird;
        this.states = [];
        this.seed = seed;
    }

    /**
     * Add a jump discontinuity at a given time.
     * NOTE: time must be integer, in frames.
     * @param time Integer time in frames
     */
    public addJump(time: number) {
        if (time % 1 !== 0) {
            throw new Error("Time stamp must be integer.");
        }
        let lastState: BirdState | undefined = undefined;
        if (_.isEmpty(this.states)) {
            this.states.push(new BirdState(this.startX, this.startY));
        } else {
            lastState = _.last(this.states);
            if (lastState) {
                if (lastState.time >= time) {
                    throw new Error("New jump can not be older than the last one.");
                }
                lastState = this.getPosition(lastState, time);
                lastState.vspeed = this.jumpSpeed; // this performs the jump
                this.states.push(lastState);
            }
        }
    }

    /**
     * Calculates the parabolic motion given a last state and current time.
     * NOTE: Time can be a fraction too.
     * @param time Time in frames
     */
    public getPosition(last: BirdState, time: number): BirdState {
        if (time < last.time) {
            throw new Error("Can not get position in the past.")
        }
        let dt = time - last.time;
        return {
            time: time,
            x: last.x + this.hspeed * dt,
            y: last.y + last.vspeed * dt + 0.5 * this.gravity * dt * dt,
            vspeed: last.vspeed + this.gravity * dt,
        }
    }
}