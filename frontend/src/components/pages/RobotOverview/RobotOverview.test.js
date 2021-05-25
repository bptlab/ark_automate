/* eslint-disable react/jsx-filename-extension */
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
  it('check if attempt to fetch occured twice', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <RobotOverview />
        </BrowserRouter>
      );
    });

    act(() => {
      userEvent.click(screen.getByText('Create new Robot'));
    });
    expect(window.fetch).toHaveBeenCalledTimes(2);
  });
});
