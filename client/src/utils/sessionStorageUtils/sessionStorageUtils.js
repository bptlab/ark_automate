import initSessionStorage from './sessionStorage';
import { getAvailableApplications } from '../../api/applicationAndTaskSelection';

const initAvailableApplicationsSessionStorage = () => {
    initSessionStorage('availableApplications', JSON.stringify([]));
    let applicationList = sessionStorage.getItem('availableApplications');
    applicationList = JSON.parse(applicationList)
    if (applicationList && applicationList.length < 1)
        getAvailableApplications()
            .then((response) => response.json())
            .then((data) => {
                sessionStorage.setItem('availableApplications', JSON.stringify(data));
            })
            .catch((error) => {
                console.error(error);
            });
}

export default initAvailableApplicationsSessionStorage;
