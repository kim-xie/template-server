import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { EsService } from '@src/datasources/es/es.service';
import { SubscribeTo } from '@src/datasources/kafka/kafka.decorator';
import { KafkaService } from '@src/datasources/kafka/kafka.service';
import { RedisService } from '@src/datasources/redis/redis.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly kafka: KafkaService,
    private readonly esService: EsService,
    private readonly redis: RedisService,
  ) {}
  getHello() {
    this.logger.log('Nest application successfully started');
    return 'Hello World!';
  }

  async redisDemo() {
    await this.redis.redisSetDemo();
    return this.redis.redisGetDemo() || 'ok';
  }

  async esDemo() {
    // ES Demo
    await this.createInterfaceMock();
    setTimeout(() => {
      this.searchESServer(dayjs());
    }, 1000);
    return 'ok';
  }

  kafkaDemo() {
    // kafka Demo
    return this.sendReport({ ip: '127.0.0.1' });
  }

  /**
   * kafka 生产者
   * @param createReportDto
   * @returns
   */
  async sendReport(createReportDto): Promise<any> {
    const payload = {
      messageId: '' + new Date().valueOf(),
      body: createReportDto,
      messageType: 'Report',
      topicName: 'tracking.report',
    };
    const value = await this.kafka.sendMessage('tracking.report', payload);
    console.log(`[KAKFA-PRODUCER] response: ${JSON.stringify(value)}`);
    return createReportDto;
  }
  /**
   * Kafka消费者
   * @param payload
   */
  @SubscribeTo('tracking.report')
  reportSubscriber(payload) {
    console.log(`[KAKFA-CONSUMER] Print message after receiving: ${payload}`);
  }

  // mock ES 接口告警数据
  async createInterfaceMock() {
    await this.esService.create({
      id: Math.random(),
      index: `performance_${dayjs().format('YYYY-MM-DD')}`,
      body: {
        index: 'performance',
        user_id: '',
        cat_event_name: 'businessMonitor',
        cat_event_type: 'sendbeacon',
        cat_domain: '100013535/h5/yiyuan',
        channel_id: '100013535',
        current_url: 'http://localhost:8188/#/doctor/detail.html',
        bhv_time: new Date(),
        create_time: new Date(), // 必须是时间格式
        log_level: 'debug',
        request_type: 1,
        os_version: '16.6',
        platform: 'iPhone',
        env: 'development',
        ext: '{"entryType":"businessMonitor","businessType":"CH","projectName": "yiyuan","monitorType":"interfaceError","userName":"hhh","userId":222914527,"unitId":200020406,"unitName":"张哥中医理疗馆","classId":"100326751","className":"中医医疗馆","url":"//wechatgate.91160.com/patient_ch/v1/doctor/index?trace_id=6d4b050f-343f-4736-825a-6cf1fdbb7bf6-1718784810224&cid=100013535&class_id=none&user_key=d24f212b7e678ed1727f30fc21fa2f36iXFEtsSA20240719094806","responseParams":"{\\"result_code\\":1,\\"error_code\\":\\"200\\",\\"error_msg\\":\\"OK\\",\\"data\\":{\\"academic_title\\":\\"博士生导师\\",\\"account_user_id\\":1123,\\"adminis_position\\":[{\\"doctor_resume_id\\":2227,\\"zcid\\":82,\\"zc_name\\":\\"业务院长\\",\\"unit_name\\":\\"深圳市宝安中医院（集团）\\",\\"dep_name\\":\\"\\"},{\\"doctor_resume_id\\":2091,\\"zcid\\":64,\\"zc_name\\":\\"党委副书记\\",\\"unit_name\\":\\"张哥中医理疗馆\\",\\"dep_name\\":\\"\\"},{\\"doctor_resume_id\\":2223,\\"zcid\\":82,\\"zc_name\\":\\"业务院长\\",\\"unit_name\\":\\"张哥中医院\\",\\"dep_name\\":\\"\\"}],\\"ask_min_price\\":\\"1\\",\\"ask_num\\":0,\\"ask_state\\":0,\\"def_detail\\":\\"欢迎扫码关注医生，了解医生最新动态。平台海量医生在线挂号、咨询、开方，更可享受专家一对一私人医生服务～\\",\\"dep_id\\":200098551,\\"dep_name\\":\\"中医科\\",\\"detail\\":\\"2011世界大学生运动会首席医官，深圳大学运动医学研究所所长，深圳市运动医学工程技术研究中心主任。卫生部关节镜基地评审委员及深圳基地主任。\\\\n师从国际运动医学与关节镜学会主席、美国运动医学协会主席匹兹堡大学运动医学中心主任Fredie. Fu教授。早年师从中山大学朱家恺院士、复旦大学顾玉东院士，并在美、德、澳、日等国与北医三院等国内外专业运动医学机构学习骨科运动医学。\\\\n致力于关节镜微创技术的全国、全球推广。独创“一结二线”肩袖修复技术、“改良双袢法Latarjet”技术，使肩关节镜下操作更简化、更安全；创新的个体化前交叉韧带重建技术，被欧美学者赞誉为“关节镜技术中的艺术”！长期担任各种国际运动医学专业大会主持或共同主席。任职国际最权威关节镜学术机构ISAKOS肩、膝关节资深委员近10年，是全球32位运动医学Godfather之一（http://www.isakos.com/campaign/godfathers）。\\\\n是亚太地区运动医学联合会（APKASS）创始委员。中华医学会运动医疗分会上肢委员会委员，中华骨科学会肩肘关节专业委员会全国委员，中国医师协会骨科分会运动医学工委会委员，中国修复重建外科学全国委员，中国老年脊柱与关节委员会全国委员。担任广东省运动医学会副主任委员，广东省医学会骨科分会关节镜学组副组长。\\\\n深圳市医学会运动医学分会主任委员，深圳市微创骨科学会主任委员。是《Clinical Anatomy》、《American J Sports Medicine》《中华医学杂志英文版 》、《Arthroscopy》（均为SCI）审稿专家、《中华医药杂志》副主编。n在SCI、国家一级刊物发表以“863、973”资助公关成果等学术论文50余篇（SCI 8篇），是除北京、上海外唯一在AJSM（美国运动医学杂志）发表长篇论文的学者。主编运动医学专著5部，主译运动医学专著2部。副主编或参编《The Shoulder》、《Shoulder and Elbow》、《骨移植学》、《中华骨科学》等大型著作18部。参与和主持国家863、973计划，国家自然基金、以及省、市资助科研课题多项，获国家医药科技成果一等奖。\\",\\"doctor_code\\":\\"https://images.91160.com/synthesis/doctorcard/200135104?unit_id=200020101\\\\u0026dep_id=200098551\\",\\"doctor_id\\":200135104,\\"doctor_ids\\":\\"200135104\\",\\"doctor_level\\":1,\\"doctor_level_name\\":\\"160星选医师\\",\\"doctor_name\\":\\"张哥\\",\\"expert\\":\\"擅长中医诊疗、擅长中医推拿。哦嗖嗖嗖欧诺欧诺我婆婆哦搜搜哦做偷摸木木木木哦哦哦破婆婆送哦肉哦木木木木哦吼女魔头哦MSN头目诺诺偷摸诺木木木木诺婆婆浓墨搜搜哦敏轰轰轰你摸\\",\\"fans_num\\":227,\\"has_note_newtips\\":0,\\"has_sns_group\\":0,\\"has_videonote_newtips\\":0,\\"ills\\":[{\\"ill_id\\":17227,\\"ill_name\\":\\"疾病名称1\\"},{\\"ill_id\\":17228,\\"ill_name\\":\\"疾病名称2\\"},{\\"ill_id\\":5165,\\"ill_name\\":\\"手指屈肌腱鞘炎\\"},{\\"ill_id\\":5765,\\"ill_name\\":\\"爱德华兹综合征\\"},{\\"ill_id\\":3840,\\"ill_name\\":\\"急性阑尾炎\\"},{\\"ill_id\\":10175,\\"ill_name\\":\\"失眠\\"}],\\"image\\":\\"https://images-test.91160.com/upload/doctor/1/doctor_5_16391322215167.png?x-oss-process=image/resize,mfit,h_100,w_100\\",\\"introduce_url\\":\\"https://wap.91160.com/vue/doctor/introduce.html?fromshare=1\\\\u0026doctor_id=200135104\\\\u0026cid=100013535\\",\\"introduce_use_flutter\\":1,\\"is_inquiry\\":1,\\"is_ask\\":0,\\"is_class\\":1,\\"is_combo_service\\":1,\\"is_followed\\":1,\\"is_gift\\":1,\\"is_inquiry_doctor\\":0,\\"is_micro_class\\":1,\\"is_note\\":1,\\"is_science\\":1,\\"is_select\\":1,\\"is_video_note\\":0,\\"is_vip\\":1,\\"is_vip_member\\":0,\\"leader_num\\":0,\\"leaderboard\\":null,\\"org_image\\":\\"https://images-test.91160.com/upload/doctor/1/doctor_5_16391322215167.png\\",\\"overall_score\\":9.1,\\"platform_doctor_id\\":200463573,\\"prev_work_unit\\":\\"\\",\\"project_tag\\":[{\\"project_id\\":3022,\\"project_name\\":\\"按摩\\"}],\\"reply_speed\\":\\"\\",\\"service_times\\":328,\\"share_description\\":\\"健康160为您提供张哥诊所总店-成人眼科张哥医生的简介、擅长、门诊排班、挂号费、患者实名评价、就医经验分享等信息,是您挂张哥诊所总店-成人眼科张哥的最佳途径.\\",\\"share_keywords\\":\\"张哥挂号,张哥预约,张哥介绍,张哥咨询,张哥评价\\",\\"share_title\\":\\"张哥预约挂号_张哥介绍_张哥咨询_健康160\\",\\"share_url\\":\\"https://wap.91160.com/vue/doctor/detail.html?fromshare=1\\\\u0026unit_id=200020101\\\\u0026dep_id=200098551\\\\u0026doc_id=200135104\\\\u0026type=guahao\\\\u0026cid=100013535\\",\\"show_inquiry\\":0,\\"show_unit_name\\":\\"第一执业张哥诊所\\",\\"social_position\\":[\\"广告机履历too弄摸摸\\",\\"觉得今生今世觉得记得记得姐姐\\",\\"内容生物钟\\"],\\"tags\\":[{\\"tag_id\\":\\"kpdr3\\",\\"tag_name\\":\\"科普大神\\",\\"tag_type\\":0,\\"text_color\\":\\"0095EA\\",\\"bg_color\\":\\"DFF3FF\\",\\"tag_img\\":\\"\\"},{\\"tag_id\\":\\"yizhen\\",\\"tag_name\\":\\"抗疫之星\\",\\"tag_type\\":0,\\"text_color\\":\\"F27B17\\",\\"bg_color\\":\\"FFE9D7\\",\\"tag_img\\":\\"\\"}],\\"unit_id\\":200020101,\\"unit_level_name\\":\\"\\",\\"unit_list\\":[{\\"unit_id\\":200020101,\\"unit_name\\":\\"张哥诊所\\",\\"unit_level_name\\":\\"其他\\",\\"dep_names\\":null,\\"is_main_unit\\":1,\\"url\\":\\"\\",\\"dep_infos\\":null},{\\"unit_id\\":200020406,\\"unit_name\\":\\"张哥中医理疗馆\\",\\"unit_level_name\\":\\"其他\\",\\"dep_names\\":null,\\"is_main_unit\\":0,\\"url\\":\\"\\",\\"dep_infos\\":null},{\\"unit_id\\":140,\\"unit_name\\":\\"深圳市宝安区中心医院（原深圳市宝安区西乡人民医院）\\",\\"unit_level_name\\":\\"其他\\",\\"dep_names\\":null,\\"is_main_unit\\":0,\\"url\\":\\"\\",\\"dep_infos\\":null},{\\"unit_id\\":125,\\"unit_name\\":\\"深圳市罗湖区人民医院\\",\\"unit_level_name\\":\\"三级甲等\\",\\"dep_names\\":null,\\"is_main_unit\\":0,\\"url\\":\\"\\",\\"dep_infos\\":null},{\\"unit_id\\":114,\\"unit_name\\":\\"深圳市宝安中医院（集团）\\",\\"unit_level_name\\":\\"三级乙等\\",\\"dep_names\\":null,\\"is_main_unit\\":0,\\"url\\":\\"\\",\\"dep_infos\\":null}],\\"unit_name\\":\\"张哥诊所\\",\\"url_unit_type\\":2,\\"user_name\\":\\"张哥\\",\\"vip_num\\":0,\\"vip_open_buttontext\\":\\"去开通\\",\\"vip_open_tipstext\\":\\"开通160VIP银卡，立享VIP价\\",\\"vip_open_url\\":\\"https://wap.91160.com/vue/member/mainTemp.html?cardId=23\\\\u0026type=23\\\\u0026cid=100013535\\\\u0026\\\\u0026city_id=0\\",\\"vote_like_icons\\":[\\"https://images-test.91160.com/upload/doctor/1/doctor_5_16311103573709.jpg?x-oss-process=image/resize,mfit,h_100,w_100\\"],\\"vote_name\\":\\"同行点赞\\",\\"vote_num\\":1,\\"vote_num_is_show\\":1,\\"vote_url\\":\\"https://docwechat.91160.com/vue/peerVote/detail?platform_doctor_id=200463573\\\\u0026cid=100013535\\",\\"yuyue_num\\":328,\\"zc_id\\":1,\\"zc_name\\":\\"主任医师\\",\\"is_virtual\\":0,\\"is_led_doctor\\":0,\\"cache_time\\":1718783671}}","opType":"医生详情","desc":"【异常测试】医生详情接口异常: 测试异常","page_url":"http://localhost:8188/#/doctor/detail.html?cid=100013535&unit_id=200020406&class_id=none&doc_id=200135104&dep_id=200123405&type=full"}',
      },
    });
  }

  // 搜索文档
  async searchDocument(kql) {
    if (!kql) return;
    try {
      this.logger.log(`es search kql: ${JSON.stringify(kql)}`);
      const response: any = await this.esService.search(kql);
      this.logger.log(`es search response: ${JSON.stringify(response)}`);
      return {
        data: response?.body?.hits?.hits,
      };
    } catch (error) {
      this.logger.error(`Error searching document: ${error}`);
    }
  }
  /**
   * es 查询服务
   * @param {*} excuteTime
   */
  async searchESServer(excuteTime) {
    const scheduleTime = 5;
    const baseTime: any = new Date(excuteTime);
    const oneMinutesAgo = new Date(baseTime - scheduleTime * 60 * 1000);
    const index = `performance_${dayjs(baseTime).format('YYYY-MM-DD')}`;
    this.logger.log(`index: ${index}`);
    const startTime = oneMinutesAgo.toISOString();
    const endTime = baseTime.toISOString();
    this.logger.log(`excuteTime: ${startTime} ${endTime}`);
    const kql = {
      index,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  'cat_event_name.keyword': 'businessMonitor',
                },
              },
              {
                range: {
                  create_time: {
                    gte: startTime,
                    lte: endTime,
                  },
                },
              },
            ],
          },
        },
        _source: ['cat_event_name', 'create_time', 'env', 'ext', 'channel_id'],
      },
    };

    const esDatas = await this.searchDocument(kql);
    if (esDatas) {
      return {
        ...esDatas,
        startTime,
        endTime,
      };
    }
  }
}
