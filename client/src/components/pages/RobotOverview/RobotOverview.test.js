/* eslint-disable no-undef */
import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RobotOverview from './RobotOverview';
import { fetchSsotsForUser, createNewRobot } from '../../../api/ssotRetrieval';
import '@testing-library/jest-dom'

const USER_ID = '80625d115100a2ee8d8e695b';
const NEW_ROBOT_NAME = 'New Robot';

// eslint-disable-next-line func-names
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener() {},
        removeListener() {}
    };
};


const mockListOfRobots = [
    {
        "_id": "12345678901234567890123a",
        "robotName": "Awesome Robot"
    },
    {
        "_id": "12345678901234567890123b",
        "robotName": "Another Robot"
    }
];

const newBotInfoMock = {
    "robotName": NEW_ROBOT_NAME,
    "robotId": "12345678901234567890123c"
};

jest.mock('../../../api/ssotRetrieval')

describe('Testing functionality behind button to trigger function call for new but creation', () => {
    it('pass successful value', async () => {
        fetchSsotsForUser.mockResolvedValueOnce(() => (mockListOfRobots))
        createNewRobot.mockResolvedValueOnce(() => (newBotInfoMock))
    
    
        expect(fetchSsotsForUser).toHaveBeenCalledTimes(0);
        expect(createNewRobot).toHaveBeenCalledTimes(0);
        // eslint-disable-next-line react/jsx-filename-extension
        render(<BrowserRouter><RobotOverview /></BrowserRouter>);
        expect(fetchSsotsForUser).toHaveBeenCalledWith(USER_ID);
        expect(fetchSsotsForUser).toHaveBeenCalledTimes(1);
    
    
        expect(createNewRobot).toHaveBeenCalledTimes(0);
        userEvent.click(screen.getByText('Create new Robot'));
        expect(createNewRobot).toHaveBeenCalledWith(USER_ID, NEW_ROBOT_NAME);
        expect(createNewRobot).toHaveBeenCalledTimes(1);
    })

    it('pass empty list for user', async () => {
        fetchSsotsForUser.mockResolvedValueOnce(() => ([]))
        createNewRobot.mockResolvedValueOnce(() => (newBotInfoMock))
    
    
        expect(fetchSsotsForUser).toHaveBeenCalledTimes(0);
        expect(createNewRobot).toHaveBeenCalledTimes(0);
        render(<BrowserRouter><RobotOverview /></BrowserRouter>);
        expect(fetchSsotsForUser).toHaveBeenCalledWith(USER_ID);
        expect(fetchSsotsForUser).toHaveBeenCalledTimes(1);
    
    
        expect(createNewRobot).toHaveBeenCalledTimes(0);
        userEvent.click(screen.getByText('Create new Robot'));
        expect(createNewRobot).toHaveBeenCalledWith(USER_ID, NEW_ROBOT_NAME);
        expect(createNewRobot).toHaveBeenCalledTimes(1);
    })
})