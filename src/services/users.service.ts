import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/models/user';
import { settings } from 'src/settings';

export class UsersService{
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${settings.apiUrl}/users`);
    }
}