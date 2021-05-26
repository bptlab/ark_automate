/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RobotOverview from './RobotOverview';
import '@testing-library/jest-dom';

const USER_ID = '80625d115100a2ee8d8e695b';
const NEW_ROBOT_NAME = 'New Robot';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

const MOCK_ROBOT_LIST = [
  {
    _id: '12345678901234567890123a',
    robotName: 'Awesome Robot',
  },
  {
    _id: '12345678901234567890123b',
    robotName: 'Another Robot',
  },
];

const MOCK_ROBOT_INFO = {
  robotName: NEW_ROBOT_NAME,
  robotId: '12345678901234567890123c',
};

async function mockFetch(url) {
  switch (url) {
    case `/users/${USER_ID}/robots`: {
      return {
        ok: true,
        status: 200,
        json: async () => MOCK_ROBOT_LIST,
      };
    }
    default: {
      throw new Error(`Unhandled request: ${url}`);
    }
  }
}

beforeAll(() => jest.spyOn(window, 'fetch'));
beforeEach(() => window.fetch.mockImplementation(mockFetch));

describe('Testing functionality behind button to trigger function call for new but creation', () => {
  it('checks if attempt to fetch occured twice', async () => {
    act(() => {
      // eslint-disable-next-line react/jsx-filename-extension
      render(
        <BrowserRouter>
          <RobotOverview />
        </BrowserRouter>
      );
    });

    act(() => {
      userEvent.click(screen.getByText('Create new Robot'));
    });
    expect(window.fetch).toHaveBeenCalledTimes(3);
  });
});
