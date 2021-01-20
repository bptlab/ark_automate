exports.matchAvailableApplications = (result) => {
    expect.assertions(3);
    expect(result).toHaveLength(2);
    expect(result).toContain('Browser');
    expect(result).toContain('MS Excel');
};

exports.matchAvailableTasksForApplication = (result) => {
    expect.assertions(2);
    expect(result).toHaveLength(1);
    expect(result).toContain('Open Browser');
};

exports.matchAvailableTasksForUnavailableApplication = (result) => {
    expect.assertions(1);
    expect(result).toHaveLength(0);
};

exports.matchIOForProvidedAppAndTask = (result) => {
    expect.assertions(3);
    expect(result).toHaveProperty('inputVars.alias');
    expect(result).toHaveProperty('inputVars.browser');
    expect(result).toHaveProperty('inputVars.url');
};

exports.matchIOForProvidedTaskWithAppUnavailable = (result) => {
    expect.assertions(1);
    expect(result).toBeFalsy();
};
