<template>
  <!-- 设置价格弹框 -->
  <div class="price-set-page">
    <el-dialog
      title="价格设置"
      :visible.sync="dialogFormVisible"
      @close="closeSupper"
    >
      <div class="set-price">
        <div class="title">供应商：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getSuppliersList"
            :key="index + 'j'"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
            @click="saveLinfrsStatus(item, index)"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label>{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="setGPrice(item)">设置</span>
          </div>
        </div>
        <div class="title">管输方：</div>
        <div class="list-com price-list">
          <div
            class="list-item pipe-tooltip"
            v-for="(item, index) in getPipelinesList"
            :key="index + 'w'"
            @click="savePipelineStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label>{{ item.name }}</label>
              <!-- 判断是否为虚拟 -->
              <span
                class="virtual"
                v-if="item.pipelineType === 2"
                @mouseenter="pipTipContentShowB(item, index)"
                @mouseleave="pipTipContentHideB(item, index)"
                >虚拟
                <i class="el-icon-question"></i>
              </span>
            </div>
            <div
              class="tooltip"
              :class="{ 'tip-content-show': item.pipTipContentShow }"
            >
              虚拟管输方参与对应供应商的采购成本计算，不展示在日报表及结算单中。
              <div class="popper__arrow"></div>
            </div>
            <span class="set-btn" @click.stop="GSetGPrice(item)">设置</span>
          </div>
        </div>
        <div class="title">用气客户：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getCompVosList"
            :key="index + 'h'"
            @click="saveCompStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label>{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="userSetGPrice(item)">设置</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
    <!-- 供应商设置 -->
    <el-dialog
      title="价格设置  /  供应商设置"
      @close="dialogFormVisible1 = false"
      :visible.sync="dialogFormVisible1"
      :key="editTimer"
    >
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGPriceItem.name }}</span>
            <span class="com-code">编号：{{ getGPriceItem.code }}</span>
          </div>
          <el-button type="info" class="submitBtn" plain @click="lifnrsExport"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClickGYS"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="content-item"
                  v-for="(item1, index) in getGPriceItemData"
                  :key="index + 'g'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input
                        type="number"
                        v-model="item1.gasPrice"
                      ></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 + 'er'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item
                            :label="'阶梯' + (index1 + 1) + '：'"
                            prop="num"
                          >
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                              :type="item2.num == '超量' ? 'text' : 'number'"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input
                              type="number"
                              v-model="item2.price"
                            ></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span class="del-step" @click="delStep(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickedgsf(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions1.pickerSpaceOptions"
                      format="yyyy/MM/dd"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceB(index)">
                    删除
                  </div>
                </div>
                <div class="addprice-btn" @click="addPriceTimePhas">
                  添加时间阶段
                </div>
                <div class="com-btn">
                  <el-button @click="gysBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="nextBtnClicked('ruleForm')"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：">
                    <el-input
                      type="number"
                      v-model="setSupplierPriceyD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setSupplierPriceyD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeCompForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="gysBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setSupplierPricey('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 用气客户设置 -->
    <el-dialog
      title="价格设置  /  用气客户设置"
      :visible.sync="dialogFormVisible2"
      :key="editTimerUser + 'l2'"
    >
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getuserchangeData.name }}</span>
            <span class="com-code">编号：{{ getuserchangeData.code }}</span>
          </div>
          <el-button
            type="info"
            class="submitBtn"
            plain
            @click="compsExportPrice"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeNameUser"
            @tab-click="handleClickkh"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="content-item"
                  v-for="(item1, index) in getlistCompPriceData"
                  :key="index + 'rt'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1" class="">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input
                        type="number"
                        v-model="item1.gasPrice"
                      ></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 + 'f'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item :label="'阶梯' + (index1 + 1) + '：'">
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                              :type="item2.num == '超量' ? 'text' : 'number'"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input
                              type="number"
                              v-model="item2.price"
                            ></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span
                            class="del-step"
                            @click="delStepUser(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickeduser(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                      format="yyyy/MM/dd"
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions2.pickerSpaceOptions"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceUser(index)">删除</div>
                </div>
                <div class="addprice-btn" @click="addPriceTimePhasUser">
                  添加时间阶段
                </div>
                <div class="com-btn">
                  <el-button @click="userBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="saveCompPrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：" prop="name">
                    <el-input
                      type="number"
                      v-model="setCompPriceYD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setCompPriceYD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeUserForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="userBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setCompPriceY('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 管输方 -->
    <el-dialog title="价格设置  /  管输方" :visible.sync="dialogFormVisible3">
      <div class="set-detail set-detail-pipe">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGSFitem.name }}</span>
            <span class="com-code">编号：{{ getGSFitem.code }}</span>
          </div>
          <el-button
            type="info"
            class="submitBtn"
            plain
            @click="pipeExportPrice"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content loser-detail">
          <el-tabs
            v-model="activeNameGSF"
            @tab-click="handleClickGSF"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="93px"
              >
                <!-- <div class="loser-top">上载点：{{ getPipelineUpGasPlace }}</div> -->
                <div class="loser-top" v-for="(place,index11) in upGasPlaceArr" :key="index11">
                <div class="loser-top">上载点：{{ place }}</div>
                  <div
                    class="loser-list"
                    v-for="(value, key, index) in ruleForm.downloadplaces"
                    :key="index + '22'"
                  >
                    <div>
                      <div class="list-top" v-if="value[0].upGasPlace === place">
                        <div class="list-top-com">
                          下载点：{{ key }}
                          <div class="custom-tooltip">
                            <i class="el-icon-warning-outline"></i>
                          </div>
                        </div>
                        <div class="list-top-com">
                          客户：{{ value.length > 0 ? value[0].compCodeTxt : "" }}
                        </div>
                      </div>
                      <div
                        v-for="(aa, index1) in value"
                        :key="index1 + '9'"
                        class="list-bott"
                      >
                        <div class="pipe-price" v-if="aa.upGasPlace === place">
                          <div class="pipe-price-item">
                            <el-form-item
                              label="管输价格："
                              :prop="`downloadplaces.${key}.${index1}.gasPrice`"
                              :rules="[
                                {
                                  required: true,
                                  message: '请输入管输价格',
                                  trigger: 'change',
                                },
                              ]"
                            >
                              <el-input
                                type="number"
                                v-model="aa.gasPrice"
                              ></el-input>
                              <span class="custom-unit">元方</span>
                            </el-form-item>
                          </div>
                          <div class="pipe-time" style="">
                            <el-form-item
                              label="生效时间："
                              :prop="`downloadplaces.${key}.${index1}.shoArr`"
                              :rules="[
                                {
                                  required: true,
                                  message: '请输入生效时间',
                                  trigger: 'change',
                                },
                              ]"
                            >
                              <el-date-picker
                                format="yyyy/MM/dd"
                                v-model="aa.shoArr"
                                :picker-options="
                                  setDataPicker['pickerSpaceOptions' + key]
                                "
                                type="daterange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                class="date-picker"
                              >
                              </el-date-picker>
                            </el-form-item>
                          </div>
                          <el-button
                            class="delete-step"
                            type="primary"
                            @click="delPipe(key, index1)"
                            >删除</el-button
                          >
                        </div>
                        
                      </div>
                      <el-button
                        class="add-step-time"
                        type="primary"
                        @click="addBtnClickedPipe(key)"
                        v-if="value[0].upGasPlace === place"
                      >
                        + 添加时间段</el-button
                      >
                    </div>
                  </div>
                </div>
                <div class="com-btn">
                  <el-button @click="gsfBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="savePipelinePrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="pipIsShow" label="预付费用" name="second">
              <div class="tab-content">
                <el-form
                  ref="form"
                  :model="form"
                  :rules="form"
                  label-width="100px"
                >
                  <el-form-item label="预付费用：">
                    <el-input
                      type="number"
                      v-model="setPipelinePriceYD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：">
                    <el-date-picker
                      v-model="setPipelinePriceYD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changePipelineForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="comBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setPipelinePriceY('form1')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 弹框确认 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%"
      class="tip-dialog"
    >
      <span class="dialog-con">
        {{ tipMessage[setTypeTip] }}
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConsole">取消</el-button>
        <el-button type="primary" @click="dialogVisibleConfirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "/src/http/api";
import {
  getFormatTime,
  getCusYear,
  getCusYear1,
  getBetweenDate,
} from "../utils/common.js";
import exportApi from "/src/components/export/export";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {},
  props: ["dialogFormVisibles"],
  data() {
    return {
      downloadplaces: {},
      dialogVisible: false,
      setStatus: null,
      setStatusIndex: 0,
      tipMessage: {
        gysT: "启用后，该供应商将参与用气交割及费用计算",
        gysF: "停用后，该供应商将不参与用气交割及费用计算",
        userF: "停用后，该用气客户将不参与用气上报、用气交割及费用计算",
        userT: "启用后，该用气客户将参与用气上报、用气交割及费用计算",
        pipeT: "启用后，该管输方将参与相关费用计算",
        pipeF: "停用后，该管输方将不参与相关费用计算",
      },
      setType: "",
      setTypeTip: "",
      pipIsShow: false, //虚拟管输是否显示预付费用
      pipTipContentShow: "", //虚拟管输方提示
      editTimer: 3, //编辑弹框key
      editTimerUser: 2,
      getuserchangeData: "", //获取用气客户当前选项
      getCompVosList: [], //A获取供应商数据
      getSuppliersList: [], //获取用气客户数据
      getPipelinesList: [], //获取管输方数据
      input: "",
      dialogFormVisible: this.dialogFormVisibles, //设置价格弹框显示
      dialogFormVisible1: false, //供应商弹框显示
      dialogFormVisible2: false, //用气客户弹框显示
      dialogFormVisible3: false, //管输方弹框显示
      activeNameGSF: "first", //g管输方tab
      activeName: "first", //供应商tab
      activeNameUser: "first", //用气客户tab
      getEntysList: [], //获取供应商客户等信息
      isChecked: true,
      planForm: {
        date: "",
        changeOptions: "",
      },
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
        arrData: [],
        downloadplaces: {},
      },
      rules: {
        date1: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        name: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
      tipContentShow: false,
      options: [],
      startTime: "",
      radio: false,
      comOptions: "",
      getGPriceItem: "", //要设置价格的供应商
      getGSFitem: "", //要设置价格的管输
      getGPriceItemData: [], //获取供应商
      getlistCompPriceData: [], //获取公司数据
      getlistPipelinePriceData: [], //获取管输价格
      pickerSpaceOptions1: {
        pickerSpaceOptions: {},
      },
      pickerSpaceOptions2: {
        pickerSpaceOptions: {},
      },
      getDisabledDate1: "",
      getDisabledDate2: "",
      tipPriceData: [], //余额提醒数据
      // 设置供应商预付费用
      setSupplierPriceyD: {
        prepaidPrice: "",
        time: "",
      },
      // 公司预付费用设置
      setCompPriceYD: {
        prepaidPrice: "",
        time: "",
      },
      setPipelinePriceYD: {
        prepaidPrice: "",
        time: "",
      },
      getPipelineUpGasPlace: "", //获取上载点
      copyPipeData: "",
      setDataPicker: [],
      upGasPlaceArr: [],  // 上载点名称数组
      loading: false, // 控制全局loading
    };
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
          this.getData();
        }
      },
    },
  },
  created() {
    this.getPlanList();
    this.planForm.date = Date.now();
    this.comOptions = this.$store.getters["companyList"];
  },
  mounted() {
    this.tipPriceE();
  },
  methods: {
    closeSupper() {
      this.dialogFormVisible = false;
      this.$emit('initSupperList')
    },
    pipTipContentShowB(val, index) {
      this.getPipelinesList[index].pipTipContentShow = true;
    },
    pipTipContentHideB(val, index) {
      this.pipTipContentShow = false;
      this.getPipelinesList[index].pipTipContentShow = false;
    },
    getData() {
      this.getPlanList();
      this.tipPriceE();
    },
    tipContentShowB() {
      this.tipContentShow = true;
    },
    tipContentHideB() {
      this.tipContentShow = false;
    },
    addPriceTimePhasUser() {
      let asd = {
        code: this.getuserchangeData.code,
        codeTxt: this.getuserchangeData.name,
        gasPrice: "",
        id: "",
        priceDesc: [
          {
            num: "",
            price: "",
          },
          {
            num: "超量",
            price: "",
          },
        ],
        shoArr: [],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: "",
      };
      this.getlistCompPriceData.push(asd);
      this.getlistCompPriceData.forEach((item) => {
        let obj = {
          num: "超量",
          price: "",
        };
        let obj1 = {
          num: "",
          price: "",
        };
        let flag = false;
        if (!item.shoArr) {
          this.$set(item, "shoArr", []);
        }
        if (item.priceDesc) {
          item.priceDesc.forEach((item) => {
            if (item.num === "max" || item.num === "超量") {
              flag = true;
            }
          });
          if (!flag) {
            item.priceDesc.push(obj);
          }
        } else {
          item.priceDesc = [];
          item.priceDesc.push(obj1);
          item.priceDesc.push(obj);
        }
      });
    },
    addPriceTimePhas() {
      let asd = {
        code: this.getGPriceItem.code,
        codeTxt: this.getGPriceItem.name,
        gasPrice: "",
        id: "",
        priceDesc: [
          {
            num: "",
            price: "",
          },
          {
            num: "超量",
            price: "",
          },
        ],
        shoArr: ["", ""],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: "",
      };
      this.getGPriceItemData.push(asd);
      this.getGPriceItemData.forEach((item) => {
        let obj = {
          num: "超量",
          price: "",
        };
        let obj1 = {
          num: "",
          price: "",
        };
        let flag = false;
        if (!item.shoArr) {
          this.$set(item, "shoArr", []);
        }
        if (item.priceDesc) {
          item.priceDesc.forEach((item) => {
            if (item.num === "max" || item.num === "超量") {
              flag = true;
            }
          });
          if (!flag) {
            item.priceDesc.push(obj);
          }
        } else {
          item.priceDesc = [];
          item.priceDesc.push(obj1);
          item.priceDesc.push(obj);
        }
      });
    },
    dialogVisibleConfirm() {
      let val = this.setStatus;
      let index = this.setStatusIndex;
      // 判断要设置的是供应商还是用气客户或者管输方
      if (this.setType == "linfnr") {
        this.LinfrsStatus(val, index);
      } else if (this.setType == "user") {
        this.CompStatus(val, index);
      } else if (this.setType == "pipe") {
        this.PipelineStatus(val, index);
      }
      this.dialogVisible = false;
    },
    dialogConsole() {
      this.dialogVisible = false;
    },
    // 调用设置供应商接口
    LinfrsStatus(val, index) {
      if (val.status == "1") {
        this.getSuppliersList[index].status = "2";
      } else {
        this.getSuppliersList[index].status = "1";
      }
      let data = {
        code: val.code,
        status: this.getSuppliersList[index].status,
      };
      api.dayGasD.saveLinfrsStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    //   保存供应商状态
    saveLinfrsStatus(val, index) {
      this.setStatus = "";
      this.setStatusIndex = "";
      this.setStatus = val;
      this.setStatusIndex = index;
      this.setTypeTip = "";
      // 1启用，2停用
      if (this.getSuppliersList[index].status == "1") {
        this.setTypeTip = "gysF";
      } else if (this.getSuppliersList[index].status == "2") {
        this.setTypeTip = "gysT";
      }
      // 判断是供应商还是用气客户
      this.setType = "linfnr";
      this.dialogVisible = true;
    },
    CompStatus(val, index) {
      if (val.status == "1") {
        this.getCompVosList[index].status = "2";
      } else {
        this.getCompVosList[index].status = "1";
      }
      let data = {
        companycode: val.code,
        status: this.getCompVosList[index].status,
      };
      api.dayGasD.saveCompStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 保存公司状态
    saveCompStatus(val, index) {
      this.setStatus = "";
      this.setStatusIndex = "";
      this.setStatus = val;
      this.setStatusIndex = index;
      this.setTypeTip = "";
      // 1启用，2停用
      if (this.getCompVosList[index].status == "1") {
        this.setTypeTip = "userF";
      } else if (this.getCompVosList[index].status == "2") {
        this.setTypeTip = "userT";
      }
      // 判断是供应商还是用气客户
      this.setType = "user";
      this.dialogVisible = true;
    },
    PipelineStatus(val, index) {
      if (val.status == "1") {
        this.getPipelinesList[index].status = "2";
      } else {
        this.getPipelinesList[index].status = "1";
      }
      let data = {
        pipelineCode: val.code,
        status: this.getPipelinesList[index].status,
      };
      api.dayGasD.savePipelineStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 管输方状态保存
    savePipelineStatus(val, index) {
      this.setStatus = "";
      this.setStatusIndex = "";
      this.setStatus = val;
      this.setStatusIndex = index;
      this.setTypeTip = "";
      // 1启用，2停用
      if(this.getPipelinesList[index].status == "1"){
         this.setTypeTip = 'pipeF'     
      }else if(this.getPipelinesList[index].status == "2"){
         this.setTypeTip = 'pipeT'
      }
      // 判断是供应商还是用气客户
      this.setType = "pipe";
      this.dialogVisible = true;
    },
    getPlanList() {
      let params = {
        xaReigCode: this.$store.getters.curCom,
      }      
      api.dayGasD.getEntys(params).then((res) => {
        if (res) {
          this.getEntysList = res;
          (this.getCompVosList =
            this.getEntysList.length > 0 ? this.getEntysList[0].companys : []), //A获取供应商数据
            (this.getSuppliersList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].suppliers
                : []), //获取用气客户数据
            (this.getPipelinesList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].pipelines
                : []); //获取管输方数据
          this.getPipelinesList.forEach((item) => {
            this.$set(item, "pipTipContentShow", false);
          });
        }
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
    },
    // 获取已选供应商
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].linfnr === arr2[0]) {
          newArr.push(arr1[i]);
        }
      }
      return newArr;
    },
    // 供应商删除时间价格阶段
    delPriceB(index){
      this.getGPriceItemData.forEach((element,index1) => {
        if(index == index1){
          this.getGPriceItemData.splice(index, 1);
        }
      });
    },
    delPriceUser(index) {
      this.getlistCompPriceData.forEach((element, index1) => {
        if (index == index1) {
          this.getlistCompPriceData.splice(index, 1);
        }
      });
    },
    addBtnClickedgsf(val) {
      this.getGPriceItemData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
        }
      });
    },
    addBtnClickeduser(val) {
      this.getlistCompPriceData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
        }
      });
    },
    // 删除阶梯
    delStep(dd) {
      this.getGPriceItemData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
    },
    delStepUser(dd) {
      this.getlistCompPriceData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
    },
    // 供应商tab栏
    handleClickGYS(tab) {
      if (tab.name == "first") {
        this.listLinrsPrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.supplierPriceList();
      }
    },
    // 用气客户tab栏
    handleClickkh(tab) {
      if (tab.name == "first") {
        this.getlistCompPrice();
      } else if (tab.name === "second") {
        this.compPriceList();
      }
    },
    // 管输方tab栏
    handleClickGSF(tab) {
      if (tab.name == "first") {
        this.getlistPipelinePrice();
      } else if (tab.name === "second") {
        this.pipelinePriceList();
      }
    },
    setPrice() {
      this.dialogFormVisible = true;
      this.getPlanList();
    },
    // 供应商设置弹框
    setGPrice(val) {
      this.getGPriceItem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = true;
      this.activeName = "first";
      this.listLinrsPrice();
      this.editTimer++;
    },
    // 管输方
    GSetGPrice(val) {
      this.getGSFitem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible3 = true;
      if (val.pipelineType === 2) {
        this.pipIsShow = false;
      } else {
        this.pipIsShow = true;
      }
      this.activeNameGSF = "first";
      this.getlistPipelinePrice(val);
    },
    // 用气客户设置
    userSetGPrice(val) {
      this.getuserchangeData = val;
      this.usergetPprice = val;
      this.activeNameUser = "first";
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = true;
      this.getlistCompPrice(val);
      this.editTimerUser++;
    },
    // 供应商价格设置
    nextBtnClicked() {
      this.saveLifnrsPrice();
    },
    // 获取供应商价格
    listLinrsPrice() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.listLinrsPrice(data).then((res) => {
        this.getGPriceItemData = res;
        this.getDisabledDate1 = res[0]
          ? getCusYear1(res[0].timeSlot.split("-")[0])
          : "";
        let that2 = this;
        this.pickerSpaceOptions1.pickerSpaceOptions = {
          disabledDate(time) {
            return time < new Date(that2.getDisabledDate1) - 24 * 3600000;
          },
        };
        this.getGPriceItemData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    // 保存设置价格供应商价格设置
    saveLifnrsPrice() {
      let deepData = this.deepClone(this.getGPriceItemData);
      let flag = 0;
      deepData.forEach((item) => {
        let dateC = [];
        dateC[0] = getCusYear(item.shoArr[0]);
        dateC[1] = getCusYear(item.shoArr[1]);
        item.timeSlot = dateC.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        item.priceDesc.forEach((item1) => {
          if (item1.num === "超量") {
            item1.num === "max";
          }
          if (item.priceType == 2 && !item1.price) {
            flag = 1;
          }
        });
        item.priceDesc = JSON.stringify(item.priceDesc);
      });
      if (!flag) {
        this.loadingStart()
        api.dayGasD.saveLifnrsPrice(deepData).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false), //供应商弹框显示
              this.loadingEnd()
            }, 1000);
          }
        });
      } else {
        this.$message({
          message: "请填写阶梯单价",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 获取管输方价格
    getlistPipelinePrice() {
       this.upGasPlaceArr = []
      let data = {
        pipeLineCode: this.getGSFitem.code,
      };
      api.dayGasD.getlistPipelinePrice(data).then((res) => {
        // start 将各分组（各上载点）数据合并到一个对象中（downGasPlaceArr）
        let downGasPlaceArr = {}
        for(let i in res[0]) {
          this.upGasPlaceArr.push(i)
          // Object.assign(downGasPlaceArr,res[0][i])
          // 多个上载点可能具有相同的下载点，使用Object.assign时会出对象键对象后面覆盖前面问题，使用下述方法解决覆盖问题（相同键不覆盖）
          for(let j in res[0][i]) {
            // 如果已合并对象中有相同键，则修改键名，在键名后加一个空格
            if(Object.keys(downGasPlaceArr).includes(j)) {
              let x = j + ' '
              downGasPlaceArr[x] = res[0][i][j]
            } else {
              downGasPlaceArr[j] = res[0][i][j]
            }
          }          
        }
        // end
        this.getlistPipelinePriceData = res;
        this.getlistPipelinePriceData.map((item) => {
          return item.upGasPlace;
        });
        // this.ruleForm.downloadplaces = res ? res[0] : {};
        this.ruleForm.downloadplaces = res ? downGasPlaceArr : {};    // 替换上一行代码
        this.getPipelineUpGasPlace = res ? res[0].upGasPlace : "";
        let getfirstObj =
          this.ruleForm.downloadplaces[
            Object.keys(this.ruleForm.downloadplaces)[0]
          ];
        this.getPipelineUpGasPlace = getfirstObj[0].upGasPlace;
        // 获取第一个开始时间，作为时间段可以选择的开始时间
        this.copyPipeData = JSON.parse(
          JSON.stringify(this.ruleForm.downloadplaces)
        );
        for (let i in this.ruleForm.downloadplaces) {
          this.ruleForm.downloadplaces[i].forEach((item) => {
            this.$set(item, "shoArr", []);
            item.shoArr[0] = item.startTime;
            item.shoArr[1] = item.endTime;
            let self = this;
            let asd = {
              disabledDate(time) {
                return (
                  time <=
                  new Date(self.ruleForm.downloadplaces[i][0].startTime) -
                    24 * 3600000
                );
              },
            };
            this.setDataPicker["pickerSpaceOptions" + i] = asd;
          });
        }
      });
    },
    // 添加管输价格
    addBtnClickedPipe(key) {
      // 获取公工信息
      let getObjP = JSON.parse(JSON.stringify(this.copyPipeData[key][0]));
      let temObj = {
        id: "",
        code: getObjP.code,
        codeTxt: getObjP.codeTxt,
        pipelineCode: getObjP.pipelineCode,
        pipelineCodeTxt: getObjP.pipelineCodeTxt,
        pipelineType: getObjP.pipelineType,
        time: null,
        gasPrice: "",
        upGasPlace: getObjP.upGasPlace,
        downGasPlace: getObjP.downGasPlace,
        year: null,
        status: getObjP.status,
        compCode: getObjP.compCode,
        compCodeTxt: getObjP.compCodeTxt,
        type: getObjP.type,
        startTime: "",
        endTime: "",
        shoArr: '',
      };
      this.ruleForm.downloadplaces[key].push(temObj);
    },
    // 删除管输价格
    delPipe(key, index) {
      for (let i in this.ruleForm.downloadplaces) {
        if (i == key) {
          this.ruleForm.downloadplaces[i].splice(index, 1);
        }
      }
    },
    // 管输方价格设置
    savePipelinePrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitArr = [];
          for (let i in this.ruleForm.downloadplaces) {
            // 计算多个时间段天数
            let allL = 0;
            this.ruleForm.downloadplaces[i].forEach((item) => {
              item.startTime = getCusYear1(item.shoArr[0]);
              item.endTime = getCusYear1(item.shoArr[1]);
              allL = allL + getBetweenDate(item.startTime, item.endTime).length;
            });
            // let FElength = getBetweenDate(this.ruleForm.downloadplaces[i][0].startTime,this.ruleForm.downloadplaces[i][this.ruleForm.downloadplaces[i].length-1].endTime).length
            // 判断多个时间段是否选择的是连续的且不重叠的
            // if(FElength !== allL){
            //     this.$message.error("请选择连续且不重叠的时间");
            //   return false
            // }
            submitArr = [...submitArr, ...this.ruleForm.downloadplaces[i]];
          }
          this.loadingStart()
          api.dayGasD.savePipelinePrice(submitArr).then((res) => {
            if (res) {
              this.$message({
                message: "设置成功",
                type: "success",
                duration: 1000,
              });
              setTimeout(() => {
                (this.dialogFormVisible = true), //设置价格弹框显示
                (this.dialogFormVisible3 = false), //供应商弹框显示
                this.loadingEnd()
              }, 1000);
            }
          });
        } else {
          this.$message.error("请将信息填写完整");
          return false;
        }
      });
    },
    // 管输价格导出
    pipeExportPrice() {
      let data = {
        pipeLineCode: this.getGSFitem.code,
      };
      api.dayGasD.pipelinePriceExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 管输方价格设置返回
    gsfBackBtn() {
      this.dialogFormVisible = true; //设置价格弹框显示
      this.dialogFormVisible3 = false; //供应商弹框显示
    },
    // 用气客户价格设置返回
    userBackBtn() {
      this.dialogFormVisible = true; //设置价格弹框显示
      this.dialogFormVisible2 = false; //供应商弹框显示
    },
    gysBackBtn() {
      this.dialogFormVisible = true; //设置价格弹框显示
      this.dialogFormVisible1 = false; //供应商弹框显示
    },
    // 获取公司价格
    getlistCompPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.getlistCompPrice(data).then((res) => {
        this.getlistCompPriceData = res;
        this.getDisabledDate2 = res[0]
          ? getCusYear1(res[0].timeSlot.split("-")[0])
          : "";
        let that2 = this;
        this.pickerSpaceOptions2.pickerSpaceOptions = {
          disabledDate(time) {
            return time < new Date(that2.getDisabledDate2) - 24 * 3600000;
          },
        };
        this.getlistCompPriceData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          item.startDate = item.timeSlot.split("-")[0];
          item.endTime = item.timeSlot.split("-")[1];
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    // 保存公司价格
    saveCompPrice() {
      let flag = 0;
      let data = this.deepClone(this.getlistCompPriceData);
      data.forEach((item) => {
        let asd = [];
        asd[0] = getCusYear(item.shoArr[0]);
        asd[1] = getCusYear(item.shoArr[1]);
        item.timeSlot = asd.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        item.priceDesc.forEach((item1) => {
          if (item1.num === "超量") {
            item1.num === "max";
          }
          if (item.priceType == 2 && !item1.price) {
            flag = 1;
          }
        });
        item.priceDesc = JSON.stringify(item.priceDesc);
      });
      if (!flag) {
        this.loadingStart()
        api.dayGasD.saveCompPrice(data).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible2 = false), //供应商弹框显示
              this.loadingEnd()
            }, 1000);
          }
        });
      } else {
        this.$message({
          message: "请填写阶梯单价",
          type: "error",
          duration: 1000,
        });
      }
    },
    // 公司价格设置返回
    comBackBtn() {
      this.dialogFormVisible = true; //设置价格弹框显示
      this.dialogFormVisible2 = false; //供应商弹框显示
    },
    exportExcel: function () {
      let params = {
        cpmoCop: this.curComCode,
        startTime: this.startTime.toString(),
        endTime: this.endTime.toString(),
      };
      api.reply.export(params).then((res) => {
        this.download(res.data, "xls", "export");
      });
    },
    // 公司价格导出
    compsExportPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.compsExportPrice(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商价格导出
    lifnrsExport() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.lifnrsExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商预付费用保存
    setSupplierPricey() {
      let parames = {
        balancePrice: 0,
        code: this.getGPriceItem.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setSupplierPriceyD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: getFormatTime(this.setSupplierPriceyD.time),
        timeSlot: "",
        year: "",
      };
      if (this.setSupplierPriceyD.prepaidPrice) {
        this.loadingStart()
        api.dayGasD.setSupplierPricey(parames).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false), //供应商弹框显示
              this.loadingEnd()
            }, 1000);
          }
        });
      } else {
        this.$message({
          message: "请输入预付费用",
          type: "error",
          duration: 1000,
        });
      }
    },
    setCompPriceY() {
      let parames = {
        balancePrice: 0,
        code: this.getuserchangeData.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setCompPriceYD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: getFormatTime(this.setCompPriceYD.time),
        timeSlot: "",
        year: "",
      };
      if (this.setCompPriceYD.prepaidPrice) {
        this.loadingStart()
        api.dayGasD.setCompPriceY(parames).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false), //供应商弹框显示
              (this.dialogFormVisible2 = false) // 保存预付费用后，隐藏“价格设置/用气客户设置”对话框
              this.loadingEnd()
            }, 1000);
          }
        });
      } else {
        this.$message({
          message: "请输入预付费用",
          type: "error",
          duration: 1000,
        });
      }
    },
    //  管输预付费用保存
    setPipelinePriceY() {
      let parames = {
        balancePrice: 0,
        id: 0,
        pipelineCode: this.getGSFitem.code,
        prepaidPrice: this.setPipelinePriceYD.prepaidPrice,
        time: getFormatTime(this.setPipelinePriceYD.time),
      };
      if (this.setPipelinePriceYD.prepaidPrice) {
        this.loadingStart()
        api.dayGasD.setPipelinePriceY(parames).then((res) => {
          if (res) {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible3 = false), //供应商弹框显示
              this.loadingEnd()
            }, 1000);
          }
        });
      } else {
        this.$message({
          message: "请输入预付费用",
          type: "error",
          duration: 1000,
        });
      }
    },
    tipPriceE() {
      let data = {
        time: getCusYear1(this.planForm.date),
      };
      api.dayGasD.tipPriceE(data).then((res) => {
        this.tipPriceData = res ? res : [];
      });
    },
    // 供应商预付费用列表
    supplierPriceList(val) {
      this.setSupplierPriceyD.prepaidPrice = "";
      let getDate = val ? val : this.planForm.date;
      let data = {
        code: this.getGPriceItem.code,
        time: getCusYear1(getDate),
      };
      api.dayGasD.getPrepaidPriceData(data).then((res) => {
        this.setSupplierPriceyD.prepaidPrice = res[0]
          ? res[0].prepaidPrice
            ? res[0].prepaidPrice
            : ""
          : "";
        this.setSupplierPriceyD.time = res[0]
          ? res[0].time
            ? res[0].time
            : ""
          : "";
      });
    },
    // 公司预付费用列表
    compPriceList(val) {
      this.setCompPriceYD.prepaidPrice = "";
      let getDate = val ? val : this.planForm.date;
      let data = {
        code: this.getuserchangeData.code,
        time: getCusYear1(getDate),
      };
      api.dayGasD.getCompPrepaidPrice(data).then((res) => {
        this.setCompPriceYD.prepaidPrice = res[0]
          ? res[0].prepaidPrice
            ? res[0].prepaidPrice
            : ""
          : "";
        this.setCompPriceYD.time = res[0]
          ? res[0].time
            ? res[0].time
            : ""
          : "";
      });
    },
    // 供应商
    changeCompForm(val) {
      this.supplierPriceList(val);
    },
    // 用气客户
    changeUserForm(val) {
      this.compPriceList(val);
    },
    // 管输方
    changePipelineForm(val) {
      this.pipelinePriceList(val);
    },
    // 管输预付费用列表
    pipelinePriceList(val) {
      this.setPipelinePriceYD.prepaidPrice = "";
      let getDate = val ? val : this.planForm.date;
      let data = {
        code: this.getGSFitem.code,
        time: getCusYear1(getDate),
      };
      api.dayGasD.getPipelinePriceData(data).then((res) => {
        this.setPipelinePriceYD.prepaidPrice = res[0].prepaidPrice
          ? res[0].prepaidPrice
          : "";
        this.setPipelinePriceYD.time = res[0].time ? res[0].time : "";
      });
    },
    // 整页加载loading开始
    loadingStart() {
      this.loading = this.$loading({
        lock: true,
        text: '保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // 整页加载loading结束
    loadingEnd() {
      this.loading.close()
    }

  },
};
</script>
<style lang='scss'>
.price-set-page {
  .el-date-editor .el-range-separator {
    width: 0%;
  }
  .date-picker-change {
    .el-input__inner {
      width: 90% !important;
    }
  }
  .price-custom {
    .el-input__inner {
      width: 90% !important;
    }
    .custom-unit {
      position: absolute;
      top: 0;
      right: 105px;
      color: #74788d;
    }
  }
  .date-picker .el-range-separator {
    color: #443939;
  }
  .date-picker .el-range-input {
    width: 100px;
  }
}
</style>
<style lang='scss' scoped>
.price-set-page {
  /deep/.el-input__inner {
    border-radius: 18px;
    background: #f6f7fa;
    width: 100%;
  }
  /deep/.el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    font-size: 24px;
    .el-dialog__headerbtn {
      font-size: 23px;
    }
  }
  .tip-dialog {
    /deep/.el-dialog__header {
      border: none;
    }
    /deep/.el-dialog__body {
      padding: 26px;
    }
  }

  /deep/.el-tabs__content {
    .el-radio-group {
      width: 100%;
      display: flex !important;
    }
    .el-radio {
      color: #606266;
      cursor: pointer;
      background: #f6f7fa;
      padding: 13px 30px;
      border-radius: 30px;
      width: 28%;
    }
    .is-checked.el-radio {
      color: #606266;
      cursor: pointer;
      border: 1px solid #0fb2ab;
      padding: 13px 30px;
      border-radius: 30px;
      background: #ffffff;
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #0fb2ab;
        background: #0fb2ab;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #0fb2ab;
      }
    }
  }
  .set-price {
    padding: 30px;
    .title {
      margin: 20px;
    }
    .list-com {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;
    }
    .price-list {
      .list-itemC {
        border: 1px solid #0fb2ab;
      }
      .pipe-tooltip {
        position: relative;
        .tooltip {
          display: none;
          position: absolute;
          top: 7px;
          right: -199px;
          width: 276px;
          height: 60px;
          line-height: 28px;
          background: #f6f7fa;
          border-radius: 9px;
          color: #999999;
          text-align: center;
          .popper__arrow {
            position: absolute;
            left: -11px;
            top: 12px;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 6px;
            border-right-color: #e5f6f6;
          }
        }
        .tip-content-show {
          display: block;
        }
      }
      .list-item {
        min-width: 32%;
        color: pink;
        border-radius: 100px;
        background: #f6f7fa;
        line-height: 44px;
        display: flex;
        justify-content: space-between;
        height: 44px;
        margin-right: 10px;
        margin-bottom: 20px;
        .el-icon-error {
          color: #4f4c4c;
        }
        .uncheced {
          margin: -2px 22px;
        }
        &:hover {
          opacity: 1;
          background: #ffffff;
          .set-btn {
            opacity: 1;
          }
        }
        i {
          padding: 0 20px;
          color: #0fb2ab;
        }
        label {
          color: #505356;
        }
        .set-btn {
          opacity: 0;
          padding: 0 13px;
          line-height: 24px;
          height: 24px;
          vertical-align: middle;
          display: inline-block;
          color: #0fb2ab;
          margin-right: 10px;
          background: #ffffff;
          border: 1px solid #0fb2ab40;
          border-radius: 16px;
          align-self: center;
        }
        .virtual {
          background: #0fb2ab;
          color: #ffffff;
          border-radius: 20px;
          padding: 6px 10px;
          margin-left: 5px;
          .el-icon-question {
            padding: 2px;
            color: #0fb2ab;
            width: 10px;
            height: 10px;
            color: #fff;
          }
        }
      }
    }
  }
  .set-detail {
    width: 85%;
    margin: 0 auto;
    .detail-title {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      .title-left {
        .com-name {
          margin-right: 20px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 600;
          line-height: 33px;
          color: #2c3e50;
          opacity: 1;
        }
        .com-code {
          padding: 1px 10px;
          border-radius: 20px;
          background: #f6f7fa;
          color: #74788d;
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 10px;
        }
      }
      .submitBtn {
        color: #0fb2ab;
        background: #fff;
        border: 1px solid #0fb2ab;
        border-radius: 100px;
      }
    }
    .detail-content {
      .addprice-btn {
        width: 119px;
        background: #0fb2ab;
        color: #ffffff;
        padding: 11px 20px;
        border-radius: 30px;
        margin-top: 20px;
        text-align: center;
      }
      .custom-tab {
        .custom-label {
          position: absolute;
          top: 0;
          left: 12px;
          color: #74788d;
        }
        .custom-unit {
          position: absolute;
          top: 0;
          right: 18px;
          color: #74788d;
        }
        .price-custom {
          .custom-unit {
            position: absolute;
            top: 0;
            right: 105px;
            color: #74788d;
          }
        }
        .step-input {
          /deep/.el-input {
            .el-input__inner {
              padding: 0 43px;
            }
          }
        }
        /deep/.date-picker {
          .el-range-input {
            background: none;
          }
        }
        /deep/.el-tabs__nav {
          .el-tabs__item {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
          }
          .el-tabs__item.is-active {
            color: #0fb2ab;
          }
          .el-tabs__active-bar {
            background: #0fb2ab;
            width: 88px !important;
            left: -13px;
          }
          #tab-first {
            border-right: 1px solid #e4e4e4;
            padding-left: 16px;
          }
        }
      }
      .del-step {
        padding: 3px 8px;
        vertical-align: top;
        display: inline-block;
        border-radius: 20px;
        border: 1px solid;
        margin-top: 8px;
        margin-left: 10px;
      }
      .tab-content {
        padding: 20px 0px;
        .addprice-btn {
          width: 119px;
          background: #0fb2ab;
          color: #ffffff;
          padding: 11px 20px;
          border-radius: 30px;
          margin-left: 32px;
        }
        .content-item {
          padding: 40px 2px;
        }
        .del-price-btn {
          background: #0fb2ab;
          text-align: center;
          width: 12%;
          border-radius: 20px;
          padding: 10px;
          color: #ffffff;
          margin: 29px 35px;
        }
        .add-step {
          background: #fff;
          border-radius: 20px;
          color: #0fb2ab;
          margin: 15px 50px 50px;
        }
        .com-btn {
          display: flex;
          justify-content: space-between;
          padding: 50px 10px;
          .el-button {
            width: 114px;
            height: 46px;
            background: #ffffff;
            border: 1px solid #d2d2dc;
            opacity: 1;
            border-radius: 100px;
            font-family: PingFang SC;
            font-weight: 500;
            i {
              margin-right: 5px;
            }
          }
          .save-btn {
            background: #0fb2ab;
            opacity: 1;
            border-radius: 100px;
            border: none;
          }
        }
        .el-input {
          width: 100%;
        }
      }
    }
    .loser-detail {
      .loser-top {
        padding: 20px 10px;
        display: inline-block;
      }
      .loser-list {
        .list-top {
          display: flex;
          padding: 20px;
          .list-top-com {
            flex: 1;
            .custom-tooltip {
              position: relative;
              display: inline-block;
              color: #0fb2ab;
              .tooltip {
                opacity: 1;
                position: absolute;
                top: 7px;
                left: 21px;
                width: 64px;
                height: 28px;
                line-height: 28px;
                background: #e5f6f6;
                border-radius: 9px;
                color: #0fb2ab;
                text-align: center;
                .popper__arrow {
                  position: absolute;
                  left: -11px;
                  top: 12px;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
                  border-width: 6px;
                  border-right-color: #e5f6f6;
                }
              }
            }
          }
          .list-top-com:hover .tooltip {
            opacity: 1;
          }
        }
        .list-bott {
          .pipe-price {
            display: flex;
            flex-flow: wrap;
            .pipe-price-item {
              flex: 1;
            }
            .pipe-time {
              // width: 50%;
              margin-left: 10px;
            }
          }
          .delete-step {
            border-radius: 20px;
            height: 39px;
            margin-left: 10px;
            background: #0fb2ab;
            border: none;
          }
        }
        .add-step-time {
          background: #0fb2ab;
          color: #fff;
          border-radius: 20px;
          margin: 15px 50px 50px;
        }
      }
    }
  }
  .set-detail-pipe {
    width: 90%;
    /deep/.el-input__inner{
       min-width: 106px;
    }
  }
}
// @import '~@/pages/purchaseAnalysis/style/index';
</style>
