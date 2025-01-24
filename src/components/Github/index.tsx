import GithubSvg from '~/assets/github.svg';

import S from './index.module.less';

export default function Github() {
  return (
    <a className={S.a} href="https://github.com/xjq7/luminous" target="_blank">
      <img src={GithubSvg} />
    </a>
  );
}
