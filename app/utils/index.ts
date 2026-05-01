export const getResourceName = (resourseUrl: string) => {
  const name = resourseUrl
    .split(".")
    [resourseUrl.split(".").length - 2]?.split("/")
    .pop();
  const public_id = resourseUrl
    .split(".")
    [resourseUrl.split(".").length - 2]?.split("/")
    .slice(-2)
    .join("/");
  return { name, public_id };
};

export function getLocalStorageData<T>(key: string): T {
  if (import.meta.client) {
    const data = window?.localStorage?.getItem(key);
    return data ? JSON.parse(data) : (null as T);
  }
  return null as T;
}

export function setLocalStorageData<T>(key: string, data: T) {
  // if (import.meta.client) {
  //     window?.localStorage?.setItem(key, JSON.stringify(data))
  // } else {
  //     window.localStorage.removeItem(key)
  // }
  if (import.meta.client) {
    if (data === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
}
