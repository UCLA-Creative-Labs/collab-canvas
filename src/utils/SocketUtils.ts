import io from 'socket.io-client'

import { CoordPath } from './PaintUtils';
import { isLocalStorageAvailable } from './StorageUtils';
import { debug } from './Utils';

// If in production, use the environment variable defined as below; otherwise,
// use the development proxy.
const socket = process.env.NODE_ENV === 'production'
                ? io(process.env.SOCKET_SERVER)
                : io({path: '/socket'});

// Upon connection, immediately send an init signal to the server to receive
// any newer strokes.
socket.emit('init', getTimestampFromStorage());

// An interface to hold handshake data retrieved from the server.
export interface Handshake{
    last_send: any,     // The timestamp of the most recent draw corresponding
                        //  to this client.
    can_undo: boolean   // Whether or not this client can undo their last stroke.
}

// Helper function to retrieve the timestamp of the most recent stroke from
// local storage. Defaults to 0 (the lowest possible timestamp) otherwise.
function getTimestampFromStorage(): number {
    if (!isLocalStorageAvailable()) return 0;

    return Number(window.localStorage.getItem('most_recent') || 0);
}

// Registers a socket listener for a handshake event.
export function registerHandshake(callback: (data: Handshake) => any) {
    socket.on('handshake', callback);
}

// Unregisters a socket listener for a handshake event.
export function unregisterHandshake(callback: (data: Handshake) => any) {
    socket.off('handshake', callback);
}

// Unregisters all socket listeners for a handshake event.
export function unregisterAllHandshake() {
    socket.off('handshake');
}

// Registers a socket listener for a package event.
export function registerPackage(callback: (data: CoordPath[]) => any) {
    socket.on('package', callback);
}

// Unregisters a socket listener for a package event.
export function unregisterPackage(callback: (data: CoordPath[]) => any) {
    socket.off('package', callback);
}

// Registers a socket listener for a new stroke event.
export function registerStroke(callback: (data: CoordPath) => any) {
    socket.on('stroke', callback);
}

// Unregisters a socket listener for a new stroke event.
export function unregisterStroke(callback: (data: CoordPath) => any) {
    socket.off('stroke', callback);
}

// Registers a listener for a reset event (development only).
export function registerReset(callback: (data: any) => any){
    socket.on('reset', callback);
}

// Unregisters a listener for a reset event.
export function unregisterReset(callback: (data: any) => any) {
    socket.off('reset', callback);
}

// Registers a socket listener for a erase event.
export function registerUndo(callback: (isErased: boolean) => any){
    socket.on('erase', callback);
}

// Unregisters a socket listener for an erase event.
export function unregisterUndo(callback: (isErased: boolean) => any){
    socket.off('erase', callback);
}

// Unregisters all socket listeners for an erase event.
export function unregisterAllUndo() {
    socket.off('erase');
}

// Registers a socket listener for a disable-undo event.
export function registerDisableUndo(callback: (disableUndo: boolean) => any) {
    socket.on('disableundo', callback);
}

// Unregisters a socket listener for a disable-undo event.
export function unregisterDisableUndo(callback: (disableUndo: boolean) => any) {
    socket.off('disableundo', callback);
}

// Registers a socket listener for a draw limit event.
export function registerDrawLimit(callback: (limit: number) => any){
    socket.on('limit', callback);
}

// Unregisters a socket listener for a draw limit event.
export function unregisterDrawLimit(callback: (limit: number) => any) {
    socket.off('limit', callback);
}

// Emits a newly drawn stroke.
export function sendStroke(stroke: CoordPath) {
    socket.emit('update', stroke);
}

// Emits an undo attempt.
export function sendUndo(isErased: boolean) {
    socket.emit('undo', null);
}

export default socket;
